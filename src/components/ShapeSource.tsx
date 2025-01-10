import {
  Component,
  forwardRef,
  memo,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import {
  type NativeMethods,
  NativeModules,
  type NativeSyntheticEvent,
  requireNativeComponent,
} from "react-native";

import { useNativeBridge } from "../hooks/useNativeBridge";
import { type BaseProps } from "../types/BaseProps";
import {
  type ExpressionField,
  type FilterExpression,
} from "../types/MapLibreRNStyles";
import { type OnPressEvent } from "../types/OnPressEvent";
import {
  cloneReactChildrenWithProps,
  isAndroid,
  isFunction,
  toJSONString,
} from "../utils";
import { getFilter } from "../utils/filterUtils";

const MLRNModule = NativeModules.MLRNModule;
export const NATIVE_MODULE_NAME = "MLRNShapeSource";

interface NativeProps {
  shape?: string;
}

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
  shape?:
    | GeoJSON.GeometryCollection
    | GeoJSON.Feature
    | GeoJSON.FeatureCollection
    | GeoJSON.Geometry;
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
  onPress?: (event: OnPressEvent) => void;
  /**
   * Overrides the default touch hitbox (44x44 pixels) for the source layers
   */
  hitbox?: {
    /**
     * `width` of hitbox
     */
    width: number;
    /**
     * `height` of hitbox
     */
    height: number;
  };

  children?: ReactNode;
}

export interface ShapeSourceRef {
  features(filter?: FilterExpression): Promise<GeoJSON.FeatureCollection>;

  getClusterExpansionZoom(feature: GeoJSON.Feature): Promise<number>;

  getClusterLeaves(
    feature: GeoJSON.Feature,
    limit: number,
    offset: number,
  ): Promise<GeoJSON.FeatureCollection>;

  getClusterChildren(
    feature: GeoJSON.Feature,
  ): Promise<GeoJSON.FeatureCollection>;

  setNativeProps: (props: NativeProps) => void;
  onPress: (event: NativeSyntheticEvent<{ payload: OnPressEvent }>) => void;

  // this was required by existing test __tests__/utils/animated/AnimatedCoordinatesArray.test.js
  _nativeRef: MLRNShapeSourceRefType | undefined;
}

/**
 * ShapeSource is a map content source that supplies vector shapes to be shown on the map.
 * The shape may be a url or a GeoJSON object
 */
export const ShapeSource = memo(
  forwardRef<ShapeSourceRef, ShapeSourceProps>(
    (
      {
        id: shapeId = MLRNModule.StyleSource.DefaultSourceID,
        ...props
      }: ShapeSourceProps,
      ref,
    ) => {
      useImperativeHandle(
        ref,
        (): ShapeSourceRef => ({
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
          features,
          /**
           * Returns the zoom needed to expand the cluster.
           *
           * @example
           * const zoom = await shapeSource.getClusterExpansionZoom(clusterId);
           *
           * @param  {GeoJSON.Feature} feature - The feature cluster to expand.
           * @return {number}
           */
          getClusterExpansionZoom,
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
          getClusterLeaves,
          /**
           * Returns the FeatureCollection from the cluster (on the next zoom level).
           *
           * @example
           * const collection = await shapeSource.getClusterChildren(clusterId);
           *
           * @param  {GeoJSON.Feature} feature - The feature cluster to expand.
           * @return {GeoJSON.FeatureCollection}
           */
          getClusterChildren,
          setNativeProps,
          onPress,
          _nativeRef: _nativeRef.current,
        }),
      );

      const _nativeRef = useRef<MLRNShapeSourceRefType>();

      const {
        _runNativeCommand,
        _runPendingNativeCommands,
        _onAndroidCallback,
      } = useNativeBridge(NATIVE_MODULE_NAME);

      const _setNativeRef = (nativeRef: MLRNShapeSourceRefType): void => {
        _nativeRef.current = nativeRef;
        _runPendingNativeCommands(nativeRef);
      };

      async function features(
        filter?: FilterExpression,
      ): Promise<GeoJSON.FeatureCollection> {
        const res: { data: string | GeoJSON.FeatureCollection } =
          await _runNativeCommand("features", _nativeRef.current, [
            getFilter(filter),
          ]);

        if (isAndroid()) {
          return JSON.parse(res.data as string);
        }

        return res.data as GeoJSON.FeatureCollection;
      }

      async function getClusterExpansionZoom(
        feature: GeoJSON.Feature,
      ): Promise<number> {
        const res: { data: number } = await _runNativeCommand(
          "getClusterExpansionZoom",
          _nativeRef.current,
          [JSON.stringify(feature)],
        );
        return res.data;
      }

      async function getClusterLeaves(
        feature: GeoJSON.Feature,
        limit: number,
        offset: number,
      ): Promise<GeoJSON.FeatureCollection> {
        const res: { data: string | GeoJSON.FeatureCollection } =
          await _runNativeCommand("getClusterLeaves", _nativeRef.current, [
            JSON.stringify(feature),
            limit,
            offset,
          ]);

        if (isAndroid()) {
          return JSON.parse(res.data as string);
        }

        return res.data as GeoJSON.FeatureCollection;
      }

      async function getClusterChildren(
        feature: GeoJSON.Feature,
      ): Promise<GeoJSON.FeatureCollection> {
        const res: { data: string | GeoJSON.FeatureCollection } =
          await _runNativeCommand("getClusterChildren", _nativeRef.current, [
            JSON.stringify(feature),
          ]);

        if (isAndroid()) {
          return JSON.parse(res.data as string);
        }

        return res.data as GeoJSON.FeatureCollection;
      }

      function setNativeProps(nativeProps: NativeProps): void {
        if (!_nativeRef.current) {
          return;
        }

        const shallowProps = Object.assign({}, nativeProps);

        // Adds support for Animated
        if (shallowProps.shape && typeof shallowProps !== "string") {
          shallowProps.shape = JSON.stringify(shallowProps.shape);
        }

        _nativeRef.current.setNativeProps(shallowProps);
      }

      function _getShape(): string | undefined {
        if (!props.shape) {
          return undefined;
        }
        return toJSONString(props.shape);
      }

      function onPress(
        event: NativeSyntheticEvent<{ payload: OnPressEvent }>,
      ): void {
        const {
          nativeEvent: {
            payload: { features, coordinates, point },
          },
        } = event;

        if (props.onPress) {
          props.onPress({
            features,
            coordinates,
            point,
          });
        }
      }

      const shapeProps = {
        id: shapeId,
        url: props.url,
        shape: _getShape(),
        hitbox: props.hitbox,
        hasPressListener: isFunction(props.onPress),
        onMapboxShapeSourcePress: onPress.bind(this),
        cluster: props.cluster ? 1 : 0,
        clusterRadius: props.clusterRadius,
        clusterMaxZoomLevel: props.clusterMaxZoomLevel,
        clusterProperties: props.clusterProperties,
        maxZoomLevel: props.maxZoomLevel,
        buffer: props.buffer,
        tolerance: props.tolerance,
        lineMetrics: props.lineMetrics,
        onPress: undefined,
        ref: _setNativeRef,
        onAndroidCallback: isAndroid() ? _onAndroidCallback : undefined,
      };

      return (
        <MLRNShapeSource {...shapeProps}>
          {cloneReactChildrenWithProps(props.children, {
            sourceID: shapeId,
          })}
        </MLRNShapeSource>
      );
    },
  ),
);

const MLRNShapeSource = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
