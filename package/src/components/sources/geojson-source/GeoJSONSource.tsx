import type {
  FilterSpecification,
  GeoJSONSourceSpecification,
} from "@maplibre/maplibre-gl-style-spec";
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

import GeoJSONSourceNativeComponent from "./GeoJSONSourceNativeComponent";
import NativeGeoJSONSourceModule from "./NativeGeoJSONSourceModule";
import { useFrozenId } from "../../../hooks/useFrozenId";
import { type BaseProps } from "../../../types/BaseProps";
import type { FeatureState } from "../../../types/FeatureState";
import type { PressableSourceProps } from "../../../types/PressableSourceProps";
import { cloneReactChildrenWithProps } from "../../../utils";
import { findNodeHandle } from "../../../utils/findNodeHandle";
import { getNativeFilter } from "../../../utils/getNativeFilter";

export type NativeGeoJSONSourceRef = Component<
  ComponentProps<typeof GeoJSONSourceNativeComponent>
> &
  ReactNativeElement;

export interface GeoJSONSourceRef {
  /**
   * Get all features from the source that match the filter, regardless of
   * visibility
   *
   * @param filter - Optional filter statement to filter the returned features
   *
   * @example
   * const data = await geoJSONSourceRef.current?.getData(clusterId);
   */
  getData(filter?: FilterSpecification): Promise<GeoJSON.FeatureCollection>;

  /**
   * Returns the zoom needed to expand the cluster.
   *
   * @param clusterId - The feature cluster to expand.
   * @returns Zoom level at which the cluster expands
   *
   * @example
   * const zoom = await geoJSONSourceRef.current?.getClusterExpansionZoom(clusterId);
   */
  getClusterExpansionZoom(clusterId: number): Promise<number>;

  /**
   * Returns the FeatureCollection from the cluster.
   *
   * @param clusterId - The feature cluster to expand.
   * @param limit - The number of points to return.
   * @param offset - The amount of points to skip (for pagination).
   *
   * @example
   * const collection = await geoJSONSourceRef.current?.getClusterLeaves(clusterId, limit, offset);
   */
  getClusterLeaves(
    clusterId: number,
    limit: number,
    offset: number,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Returns the FeatureCollection from the cluster (on the next zoom level).
   *
   * @param clusterId - The feature cluster to expand.
   *
   * @example
   * const collection = await geoJSONSourceRef.current?.getClusterChildren(clusterId);
   */
  getClusterChildren(clusterId: number): Promise<GeoJSON.Feature[]>;

  /**
   * Sets the `state` of a feature. A feature's `state` is a set of user-defined
   * key-value pairs that are assigned to a feature at runtime. The given `state`
   *  object is merged with any existing key-value pairs in the feature's state.
   * Features are identified by their `id` , which can be any number or string.
   * The feature must carry an `id` in the source data.
   *
   * Use the `feature-state` expression to access the values in a feature's state
   * object for the purposes of styling. Only paint properties support it.
   *
   * @param feature - Feature identifier
   * @param state - A set of key-value pairs. The values should be valid JSON types.
   *
   * @example
   * ```ts
   * await geoJSONSourceRef.current?.setFeatureState(
   *   { id: feature.id },
   *   { selected: true },
   * );
   * ```
   */
  setFeatureState(
    feature: { id: string | number },
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
   * const state = await geoJSONSourceRef.current?.getFeatureState({
   *   id: feature.id,
   * });
   * ```
   */
  getFeatureState(feature: {
    id: string | number;
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
   * await geoJSONSourceRef.current?.removeFeatureState({ id: feature.id });
   * // Reset only the `selected` key of one feature
   * await geoJSONSourceRef.current?.removeFeatureState(
   *   { id: feature.id },
   *   "selected",
   * );
   * ```
   */
  removeFeatureState(
    feature: { id: string | number },
    key?: string,
  ): Promise<void>;

  /**
   * Removes the `state` of all features in the source, setting them back to the
   * default behavior.
   *
   * Removals are applied on the next rendered frame, so `getFeatureState` called
   * immediately afterwards may still return the removed entries.
   *
   * @example
   * ```ts
   * await geoJSONSourceRef.current?.removeFeatureState();
   * ```
   */
  removeFeatureState(): Promise<void>;

  /**
   * Returns the native ref for Reanimated compatibility.
   */
  getAnimatableRef(): NativeGeoJSONSourceRef | null;
}

export interface GeoJSONSourceProps extends BaseProps, PressableSourceProps {
  /**
   * A string that uniquely identifies the source.
   */
  id?: string;

  /**
   * Can be provided as one of:
   * - An HTTP(S) URL, absolute file URL, or local file URL relative to the current
   *   application’s resource bundle
   * - Any valid GeoJSON object
   */
  data: string | GeoJSON.GeoJSON;

  /**
   * Enables clustering on the source
   */
  cluster?: boolean;

  /**
   * Specifies the radius of each cluster if clustering is enabled. A value of 512
   * produces a radius equal to the width of a tile. The default value is 50.
   */
  clusterRadius?: number;

  /**
   * Specifies minimum number of points to form a cluster if clustering is
   * enabled. The default value is 2.
   */
  clusterMinPoints?: number;

  /**
   * Specifies the maximum zoom level at which to cluster points if clustering is
   * enabled. Defaults to one zoom level less than the value of maxzoom so that,
   * at the maximum zoom, the data is not clustered.
   */
  clusterMaxZoom?: number;

  /**
   * Specifies custom properties on the generated clusters if clustering is
   * enabled, aggregating values from clustered points.
   *
   * Has the form `{ "property_name": [operator, map_expression]}` , where
   * `operator` is a custom reduce expression that references a special
   * `["accumulated"]` value - it accumulates the property value from
   * clusters/points the cluster contains `map_expression` produces the value of a
   * single point
   *
   * @example `{ "resultingSum": [["+", ["accumulated"], ["get", "resultingSum"]], ["get", "scalerank"]] }`
   */
  clusterProperties?: GeoJSONSourceSpecification["clusterProperties"];

  /**
   * Specifies the maximum zoom level at which to create vector tiles. A greater
   * value produces greater detail at high zoom levels. The default value is 18.
   */
  maxzoom?: number;

  /**
   * Specifies the size of the tile buffer on each side. A value of 0 produces no
   * buffer. A value of 512 produces a buffer as wide as the tile itself. Larger
   * values produce fewer rendering artifacts near tile edges and slower
   * performance. The default value is 128.
   */
  buffer?: number;

  /**
   * Douglas-Peucker simplification tolerance applied to geometries
   *
   * Higher means simpler geometries and faster performance.
   *
   * @defaultValue 0.375
   */
  tolerance?: number;

  /**
   * Whether to calculate line distance metrics. This is required for line layers
   * that specify lineGradient values. The default value is false.
   */
  lineMetrics?: boolean;

  children?: ReactNode;

  /**
   * Ref to access GeoJSONSource methods.
   */
  ref?: Ref<GeoJSONSourceRef>;
}

/**
 * GeoJSONSource is a map content source that supplies GeoJSON to be shown on
 * the map. The data may be provided as an url or a GeoJSON object.
 */
export const GeoJSONSource = memo(
  ({ id, data, ref, ...props }: GeoJSONSourceProps) => {
    const nativeRef = useRef<NativeGeoJSONSourceRef>(null);

    const frozenId = useFrozenId(id);

    function removeFeatureState(
      feature: { id: string | number },
      key?: string,
    ): Promise<void>;
    function removeFeatureState(): Promise<void>;
    function removeFeatureState(
      feature?: { id: string | number },
      key?: string,
    ): Promise<void> {
      return NativeGeoJSONSourceModule.removeFeatureState(
        findNodeHandle(nativeRef.current),
        feature ? String(feature.id) : null,
        key ?? null,
      );
    }

    useImperativeHandle(ref, () => ({
      getData: async (filter) => {
        return NativeGeoJSONSourceModule.getData(
          findNodeHandle(nativeRef.current),
          getNativeFilter(filter),
        );
      },

      getClusterExpansionZoom: async (clusterId) => {
        return NativeGeoJSONSourceModule.getClusterExpansionZoom(
          findNodeHandle(nativeRef.current),
          clusterId,
        );
      },

      getClusterLeaves: async (
        clusterId: number,
        limit: number,
        offset: number,
      ) => {
        return NativeGeoJSONSourceModule.getClusterLeaves(
          findNodeHandle(nativeRef.current),
          clusterId,
          limit,
          offset,
        );
      },

      getClusterChildren: async (clusterId: number) => {
        return NativeGeoJSONSourceModule.getClusterChildren(
          findNodeHandle(nativeRef.current),
          clusterId,
        );
      },

      setFeatureState: async ({ id }, state) => {
        return NativeGeoJSONSourceModule.setFeatureState(
          findNodeHandle(nativeRef.current),
          String(id),
          state,
        );
      },

      getFeatureState: async ({ id }) => {
        const state = (await NativeGeoJSONSourceModule.getFeatureState(
          findNodeHandle(nativeRef.current),
          String(id),
        )) as FeatureState | null | undefined;

        return state ?? null;
      },

      removeFeatureState,

      getAnimatableRef: () =>
        nativeRef.current
          ? new Proxy(nativeRef.current, {
              get: (target, prop) =>
                prop === "_viewConfig"
                  ? (target as unknown as { __viewConfig: unknown })
                      .__viewConfig
                  : target[prop as keyof typeof target],
            })
          : null,
    }));

    return (
      <GeoJSONSourceNativeComponent
        ref={nativeRef}
        id={frozenId}
        data={typeof data === "string" ? data : JSON.stringify(data)}
        hasOnPress={!!props.onPress}
        {...props}
      >
        {cloneReactChildrenWithProps(props.children, {
          source: frozenId,
        })}
      </GeoJSONSourceNativeComponent>
    );
  },
);
