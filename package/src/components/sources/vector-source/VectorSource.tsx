import type { FilterSpecification } from "@maplibre/maplibre-gl-style-spec";
import {
  Component,
  type ComponentProps,
  memo,
  type ReactNode,
  type Ref,
  useImperativeHandle,
  useRef,
} from "react";
import { type ReactNativeElement } from "react-native";

import NativeVectorSourceModule from "./NativeVectorSourceModule";
import VectorSourceNativeComponent from "./VectorSourceNativeComponent";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import type { FeatureState } from "../../../types/FeatureState";
import type { PressableSourceProps } from "../../../types/PressableSourceProps";
import { cloneReactChildrenWithProps } from "../../../utils";
import { findNodeHandle } from "../../../utils/findNodeHandle";
import { getNativeFilter } from "../../../utils/getNativeFilter";

export interface VectorSourceRef {
  /**
   * Returns all features that match the query parameters regardless of whether
   * the feature is currently rendered on the map. The domain of the query
   * includes all currently-loaded vector tiles and GeoJSON source tiles. This
   * function does not check tiles outside the visible viewport.
   *
   * @example
   * ```ts
   * vectorSource.querySourceFeatures({ sourceLayer: "some-source-layer" });
   * ```
   */
  querySourceFeatures(options: {
    sourceLayer: string;
    filter?: FilterSpecification;
  }): Promise<GeoJSON.Feature[]>;

  /**
   * Sets the `state` of a feature. A feature's `state` is a set of user-defined
   * key-value pairs that are assigned to a feature at runtime. The given `state`
   *  object is merged with any existing key-value pairs in the feature's state.
   * Features are identified by their `id` within a `sourceLayer` , which can be
   * any number or string. The feature must carry an `id` in the vector tile data.
   *
   * Use the `feature-state` expression to access the values in a feature's state
   * object for the purposes of styling. Only paint properties support it.
   *
   * @param feature - Feature identifier
   * @param state - A set of key-value pairs. The values should be valid JSON types.
   *
   * @example
   * ```ts
   * await vectorSourceRef.current?.setFeatureState(
   *   { id: feature.id, sourceLayer: "buildings" },
   *   { selected: true },
   * );
   * ```
   */
  setFeatureState(
    feature: { id: string | number; sourceLayer: string },
    state: FeatureState,
  ): Promise<void>;

  /**
   * Gets the `state` of a feature. Resolves to `null` when the feature has no
   * state.
   *
   * @param feature - Feature identifier
   *
   * @example
   * ```ts
   * const state = await vectorSourceRef.current?.getFeatureState({
   *   id: feature.id,
   *   sourceLayer: "buildings",
   * });
   * ```
   */
  getFeatureState(feature: {
    id: string | number;
    sourceLayer: string;
  }): Promise<FeatureState | null>;

  /**
   * Removes the `state` of a feature, setting it back to the default behavior. If
   * only `feature.id` is specified, it removes all keys of that feature's state.
   * If `key` is also specified, it removes only that key of that feature's state.
   * A `key` can only be removed for a specific feature; there is no way to remove
   * one key from every feature at once.
   *
   * Removals are applied on the next rendered frame, so `getFeatureState` called
   * immediately afterwards may still return the removed entries.
   *
   * @param feature - Feature identifier
   * @param key - The key in the feature state to reset
   *
   * @example
   * ```ts
   * // Reset the entire state of one feature
   * await vectorSourceRef.current?.removeFeatureState({
   *   id: feature.id,
   *   sourceLayer: "buildings",
   * });
   * // Reset only the `selected` key of one feature
   * await vectorSourceRef.current?.removeFeatureState(
   *   { id: feature.id, sourceLayer: "buildings" },
   *   "selected",
   * );
   * ```
   */
  removeFeatureState(
    feature: { id: string | number; sourceLayer: string },
    key?: string,
  ): Promise<void>;

  /**
   * Removes the `state` of all features in the given source layer, setting them
   * back to the default behavior.
   *
   * Removals are applied on the next rendered frame, so `getFeatureState` called
   * immediately afterwards may still return the removed entries.
   *
   * @param feature - Source layer identifier
   *
   * @example
   * ```ts
   * await vectorSourceRef.current?.removeFeatureState({
   *   sourceLayer: "buildings",
   * });
   * ```
   */
  removeFeatureState(feature: { sourceLayer: string }): Promise<void>;
}

export interface VectorSourceProps extends BaseProps, PressableSourceProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * A URL to a TileJSON configuration file describing the source’s contents and
   * other metadata.
   */
  url?: string;

  /**
   * An array of tile URL templates. If multiple endpoints are specified, clients
   * may use any combination of endpoints. Common format should be:
   * `https://example.com/vector-tiles/{z}/{x}/{y}.pbf` .
   */
  tiles?: string[];

  /**
   * An unsigned integer that specifies the minimum zoom level at which to display
   * tiles from the source. The value should be between 0 and 22, inclusive, and
   * less than maxzoom, if specified. The default value for this option is 0.
   */
  minzoom?: number;

  /**
   * An unsigned integer that specifies the maximum zoom level at which to display
   * tiles from the source. The value should be between 0 and 22, inclusive, and
   * less than minzoom, if specified. The default value for this option is 22.
   */
  maxzoom?: number;

  /**
   * Influences the y direction of the tile coordinates. (tms inverts y-axis)
   *
   * @defaultValue "xyz"
   */
  scheme?: "xyz" | "tms";

  /**
   * An HTML or literal text string defining the buttons to be displayed in an
   * action sheet when the source is part of a map view’s style and the map view’s
   * attribution button is pressed.
   */
  attribution?: string;

  children?: ReactNode;

  /**
   * Ref to access VectorSource methods.
   */
  ref?: Ref<VectorSourceRef>;
}

/**
 * VectorSource is a map content source that supplies tiled vector data in
 * Mapbox Vector Tile format to be shown on the map. The location of and
 * metadata about the tiles are defined either by an option dictionary or by an
 * external file that conforms to the TileJSON specification.
 */
export const VectorSource = memo(({ id, ref, ...props }: VectorSourceProps) => {
  const nativeRef = useRef<
    Component<ComponentProps<typeof VectorSourceNativeComponent>> &
      ReactNativeElement
  >(null);

  const frozenId = useFrozenId(id);

  function removeFeatureState(
    feature: { id: string | number; sourceLayer: string },
    key?: string,
  ): Promise<void>;
  function removeFeatureState(feature: { sourceLayer: string }): Promise<void>;
  function removeFeatureState(
    { id, sourceLayer }: { id?: string | number; sourceLayer: string },
    key?: string,
  ): Promise<void> {
    return NativeVectorSourceModule.removeFeatureState(
      findNodeHandle(nativeRef.current),
      id === undefined ? null : String(id),
      sourceLayer,
      key ?? null,
    );
  }

  useImperativeHandle(ref, () => ({
    querySourceFeatures: async ({
      sourceLayer,
      filter,
    }: {
      sourceLayer: string;
      filter?: FilterSpecification;
    }): Promise<GeoJSON.Feature[]> => {
      return NativeVectorSourceModule.querySourceFeatures(
        findNodeHandle(nativeRef.current),
        sourceLayer,
        getNativeFilter(filter) as string[],
      );
    },

    setFeatureState: async ({ id, sourceLayer }, state) => {
      return NativeVectorSourceModule.setFeatureState(
        findNodeHandle(nativeRef.current),
        String(id),
        sourceLayer,
        state,
      );
    },

    getFeatureState: async ({ id, sourceLayer }) => {
      const state = (await NativeVectorSourceModule.getFeatureState(
        findNodeHandle(nativeRef.current),
        String(id),
        sourceLayer,
      )) as FeatureState | null | undefined;

      return state ?? null;
    },

    removeFeatureState,
  }));

  return (
    <VectorSourceNativeComponent
      ref={nativeRef}
      id={frozenId}
      hasOnPress={!!props.onPress}
      {...props}
    >
      {cloneReactChildrenWithProps(props.children, {
        source: frozenId,
      })}
    </VectorSourceNativeComponent>
  );
});
