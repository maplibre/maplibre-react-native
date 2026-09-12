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
   * Merges the given `state` object into the runtime state of the feature
   * identified by `featureId` within the given `sourceLayer` and keeps existing
   * keys that are not part of the update. The feature must carry an `id` in the
   * vector tile data. Style expressions read the state through the
   * `feature-state` operator, which only paint properties support.
   *
   * @param state - Key-value pairs to merge into the feature's state
   *
   * @example
   * ```ts
   * await vectorSourceRef.current?.setFeatureState(
   *   { sourceLayer: "buildings", featureId: feature.id },
   *   { selected: true },
   * );
   * ```
   */
  setFeatureState(
    options: { sourceLayer: string; featureId: string | number },
    state: FeatureState,
  ): Promise<void>;

  /**
   * Returns the current runtime state of a feature, or `null` when the feature
   * has no state.
   *
   * @example
   * ```ts
   * const state = await vectorSourceRef.current?.getFeatureState({
   *   sourceLayer: "buildings",
   *   featureId: feature.id,
   * });
   * ```
   */
  getFeatureState(options: {
    sourceLayer: string;
    featureId: string | number;
  }): Promise<FeatureState | null>;

  /**
   * Removes runtime state within the given `sourceLayer` layer. The scope depends
   * on the given options:
   * - `featureId` and `key`: removes one key from one feature
   * - `featureId` only: removes all state from one feature
   * - neither: removes all state from every feature in the source layer
   *
   * A `key` can only be removed for a specific feature; there is no way to remove
   * one key from every feature at once.
   *
   * Removals are applied on the next rendered frame, so `getFeatureState` called
   * immediately afterwards may still return the removed entries.
   *
   * @example
   * ```ts
   * await vectorSourceRef.current?.removeFeatureState({
   *   sourceLayer: "buildings",
   *   featureId: feature.id,
   *   key: "selected",
   * });
   * ```
   */
  removeFeatureState(
    options:
      | { sourceLayer: string }
      | { sourceLayer: string; featureId: string | number; key?: string },
  ): Promise<void>;
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

    setFeatureState: async ({ sourceLayer, featureId }, state) => {
      return NativeVectorSourceModule.setFeatureState(
        findNodeHandle(nativeRef.current),
        sourceLayer,
        String(featureId),
        state,
      );
    },

    getFeatureState: async ({ sourceLayer, featureId }) => {
      const state = (await NativeVectorSourceModule.getFeatureState(
        findNodeHandle(nativeRef.current),
        sourceLayer,
        String(featureId),
      )) as FeatureState | null | undefined;

      return state ?? null;
    },

    removeFeatureState: async (options) => {
      return NativeVectorSourceModule.removeFeatureState(
        findNodeHandle(nativeRef.current),
        options.sourceLayer,
        "featureId" in options ? String(options.featureId) : null,
        "featureId" in options ? (options.key ?? null) : null,
      );
    },
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
