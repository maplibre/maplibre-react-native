import {
  Component,
  type ComponentProps,
  forwardRef,
  memo,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import {
  type NativeMethods,
  type NativeSyntheticEvent,
  type ViewProps,
} from "react-native";

import ShapeSourceNativeComponent, {
  type NativeProps,
} from "./ShapeSourceNativeComponent";
import { type BaseProps } from "../../../types/BaseProps";
import {
  type ExpressionField,
  type FilterExpression,
} from "../../../types/MapLibreRNStyles";
import { type PressEventWithFeatures } from "../../../types/PressEvent";
import { cloneReactChildrenWithProps } from "../../../utils";
import { getFilter } from "../../../utils/filterUtils";

type MLRNShapeSourceRefType = Component<NativeProps> & Readonly<NativeMethods>;

export interface ShapeSourceProps extends BaseProps {
  /**
   * A string that uniquely identifies the source.
   */
  id: string;

  /**
   * An HTTP(S) URL, absolute file URL, or local file URL relative to the current application’s resource bundle.
   */
  url?: string;

  /**
   * The contents of the source. A shape can represent a GeoJSON geometry, a feature, or a feature colllection.
   */
  data?: string | GeoJSON.GeoJSON;

  /**
   * Enables clustering on the source for point shapes.
   */
  cluster?: boolean;

  /**
   * Specifies the radius of each cluster if clustering is enabled.
   * A value of 512 produces a radius equal to the width of a tile.
   * The default value is 50.
   */
  clusterRadius?: number;

  /**
   * Specifies minimum number of points to form a cluster if clustering is enabled.
   * The default value is 2.
   */
  clusterMinPoints?: number;

  /**
   * Specifies the maximum zoom level at which to cluster points if clustering is enabled.
   * Defaults to one zoom level less than the value of maxZoomLevel so that, at the maximum zoom level,
   * the shapes are not clustered.
   */
  clusterMaxZoomLevel?: number;

  /**
   * Specifies custom properties on the generated clusters if clustering
   * is enabled, aggregating values from clustered points.
   *
   * Has the form `{ "property_name": [operator, map_expression]}`, where
   *  `operator` is a custom reduce expression that references a special `["accumulated"]` value -
   *   it accumulates the property value from clusters/points the cluster contains
   *  `map_expression` produces the value of a single point
   *
   * @example `{ "resultingSum": [["+", ["accumulated"], ["get", "resultingSum"]], ["get", "scalerank"]] }`
   *
   */
  clusterProperties?: { [propertyName: string]: ExpressionField };

  /**
   * Specifies the maximum zoom level at which to create vector tiles.
   * A greater value produces greater detail at high zoom levels.
   * The default value is 18.
   */
  maxZoomLevel?: number;

  /**
   * Specifies the size of the tile buffer on each side.
   * A value of 0 produces no buffer. A value of 512 produces a buffer as wide as the tile itself.
   * Larger values produce fewer rendering artifacts near tile edges and slower performance.
   * The default value is 128.
   */
  buffer?: number;

  /**
   * Specifies the Douglas-Peucker simplification tolerance.
   * A greater value produces simpler geometries and improves performance.
   * The default value is 0.375.
   */
  tolerance?: number;

  /**
   * Whether to calculate line distance metrics.
   * This is required for line layers that specify lineGradient values.
   * The default value is false.
   */
  lineMetrics?: boolean;

  /**
   * Source press listener, gets called when a user presses one of the children layers only if that layer has a higher z-index than another source layers.
   */
  onPress?: (event: NativeSyntheticEvent<PressEventWithFeatures>) => void;

  /**
   * Overrides the default touch hitbox (44x44 pixels) for the source layers
   */
  hitSlop?: ViewProps["hitSlop"];

  children?: ReactNode;
}

export interface ShapeSourceRef {
  /**
   * Returns all features from the source that match the query parameters regardless of whether or not the feature is
   * currently rendered on the map.
   *
   * @example
   * shapeSource.features()
   *
   * @param  {Array=} filter - an optional filter statement to filter the returned Features.
   * @return {GeoJSON.FeatureCollection}
   */
  getData(filter?: FilterExpression): Promise<GeoJSON.GeoJSON>;

  /**
   * Returns the zoom needed to expand the cluster.
   *
   * @example
   * const zoom = await shapeSource.getClusterExpansionZoom(clusterId);
   *
   * @param  {GeoJSON.Feature} feature - The feature cluster to expand.
   * @return {number}
   */
  getClusterExpansionZoom(feature: GeoJSON.Feature): Promise<number>;

  /**
   * Returns the FeatureCollection from the cluster.
   *
   * @example
   * const collection = await shapeSource.getClusterLeaves(clusterId, limit, offset);
   *
   * @param  {GeoJSON.Feature} feature - The feature cluster to expand.
   * @param  {number} limit - The number of points to return.
   * @param  {number} offset - The amount of points to skip (for pagination).
   * @return {GeoJSON.FeatureCollection}
   */
  getClusterLeaves(
    feature: GeoJSON.Feature,
    limit: number,
    offset: number,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Returns the FeatureCollection from the cluster (on the next zoom level).
   *
   * @example
   * const collection = await shapeSource.getClusterChildren(clusterId);
   *
   * @param  feature - The feature cluster to expand.
   */
  getClusterChildren(feature: GeoJSON.Feature): Promise<GeoJSON.Feature[]>;

  setNativeProps: (props: NativeProps) => void;

  // this was required by existing test __tests__/utils/animated/AnimatedCoordinatesArray.test.js
  _nativeRef: MLRNShapeSourceRefType | null;
}

/**
 * ShapeSource is a map content source that supplies vector shapes to be shown on the map.
 * The shape may be a url or a GeoJSON object
 */
export const ShapeSource = memo(
  forwardRef<ShapeSourceRef, ShapeSourceProps>((props, ref) => {
    const nativeRef = useRef<
      Component<ComponentProps<typeof ShapeSourceNativeComponent>> &
        Readonly<NativeMethods>
    >(null);

    useImperativeHandle(ref, () => ({
      ...nativeRef.current,

      features,

      getClusterExpansionZoom,

      getClusterLeaves: async (
        feature: GeoJSON.Feature,
        limit: number,
        offset: number,
      ) => {
        const res: { data: string | GeoJSON.FeatureCollection } =
          await _runNativeCommand("getClusterLeaves", nativeRef.current, [
            JSON.stringify(feature),
            limit,
            offset,
          ]);

        return res.data as GeoJSON.FeatureCollection;
      },

      getClusterChildren,

      setNativeProps: (nativeProps: NativeProps) => {
        if (!nativeRef.current) {
          return;
        }

        const shallowProps = Object.assign({}, nativeProps);

        // Adds support for Animated
        if (shallowProps.shape && typeof shallowProps.shape !== "string") {
          shallowProps.shape = JSON.stringify(shallowProps.shape);
        }

        nativeRef.current.setNativeProps(shallowProps);
      },

      _nativeRef: nativeRef.current,
    }));

    async function features(
      filter?: FilterExpression,
    ): Promise<GeoJSON.FeatureCollection> {
      const res: { data: string | GeoJSON.FeatureCollection } =
        await _runNativeCommand("features", nativeRef.current, [
          getFilter(filter),
        ]);

      return res.data as GeoJSON.FeatureCollection;
    }

    async function getClusterExpansionZoom(
      feature: GeoJSON.Feature,
    ): Promise<number> {
      const res: { data: number } = await _runNativeCommand(
        "getClusterExpansionZoom",
        nativeRef.current,
        [JSON.stringify(feature)],
      );
      return res.data;
    }

    async function getClusterChildren(
      feature: GeoJSON.Feature,
    ): Promise<GeoJSON.FeatureCollection> {
      const res: { data: string | GeoJSON.FeatureCollection } =
        await _runNativeCommand("getClusterChildren", nativeRef.current, [
          JSON.stringify(feature),
        ]);

      return res.data as GeoJSON.FeatureCollection;
    }

    return (
      <ShapeSourceNativeComponent ref={nativeRef} {...props}>
        {cloneReactChildrenWithProps(props.children, {
          sourceID: props.id,
        })}
      </ShapeSourceNativeComponent>
    );
  }),
);
