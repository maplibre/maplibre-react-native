import debounce from 'debounce';
import React, {
  Component,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  NativeModules,
  requireNativeComponent,
  ViewProps,
  NativeMethods,
  NativeSyntheticEvent,
} from 'react-native';

import useNativeBridge from '../hooks/useNativeBridge';
import useOnce from '../hooks/useOnce';
import {Location} from '../modules/location/locationManager';
import BaseProps from '../types/BaseProps';
import {isFunction, isAndroid} from '../utils';
import Logger from '../utils/Logger';
import {FilterExpression} from '../utils/MaplibreStyles';
import {getFilter} from '../utils/filterUtils';

const MapLibreGL = NativeModules.MLNModule;
if (MapLibreGL == null) {
  console.error(
    'Native part of Mapbox React Native libraries were not registered properly, double check our native installation guides.',
  );
}

export const NATIVE_MODULE_NAME = 'RCTMLNMapView';

export const ANDROID_TEXTURE_NATIVE_MODULE_NAME = 'RCTMLNAndroidTextureMapView';

const styles = StyleSheet.create({
  matchParent: {flex: 1},
});

const defaultStyleURL = MapLibreGL.StyleURL.Street;

export interface RegionPayload {
  zoomLevel: number;
  heading: number;
  animated: boolean;
  isUserInteraction: boolean;
  visibleBounds: VisibleBounds;
  pitch: number;
}

type VisibleBounds = [northEast: GeoJSON.Position, southWest: GeoJSON.Position];

interface MapViewProps extends BaseProps {
  /**
   * The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport.
   */
  contentInset?: number[] | number;
  /**
   * Style for wrapping React Native View
   */
  style?: ViewProps['style'];
  /**
   * Style URL for map - notice, if non is set it _will_ default to `MapLibreGL.StyleURL.Default`
   */
  styleURL?: string;
  /**
   * StyleJSON for map - according to TileJSON specs: https://github.com/mapbox/tilejson-spec
   */
  styleJSON?: string;
  /**
   * iOS: The preferred frame rate at which the map view is rendered.
   * The default value for this property is MLNMapViewPreferredFramesPerSecondDefault,
   * which will adaptively set the preferred frame rate based on the capability of
   * the user’s device to maintain a smooth experience. This property can be set to arbitrary integer values.
   *
   * Android: The maximum frame rate at which the map view is rendered, but it can't excess the ability of device hardware.
   * This property can be set to arbitrary integer values.
   */
  preferredFramesPerSecond?: number;
  /**
   * Automatically change the language of the map labels to the system’s preferred language,
   * this is not something that can be toggled on/off
   */
  localizeLabels?: boolean;
  /**
   * Enable/Disable zoom on the map
   */
  zoomEnabled?: boolean;
  /**
   * Enable/Disable scroll on the map
   */
  scrollEnabled?: boolean;
  /**
   * Enable/Disable pitch on map
   */
  pitchEnabled?: boolean;
  /**
   * Enable/Disable rotation on map
   */
  rotateEnabled?: boolean;
  /**
   * Enable/Disable attribution on map.
   *
   * This must be enabled for Mapbox-hosted tiles and styles. Please refer to the Mapbox Terms of Service.
   * Other providers do not require this.
   */
  attributionEnabled?: boolean;
  /**
   * Adds attribution offset, e.g. `{top: 8, left: 8}` will put attribution button in top-left corner of the map
   */
  attributionPosition?:
    | {top?: number; left?: number}
    | {top?: number; right?: number}
    | {bottom?: number; left?: number}
    | {bottom?: number; right?: number};
  /**
   * MapView's tintColor
   */
  tintColor?: string | unknown[];
  /**
   * Enable/Disable the logo on the map.
   */
  logoEnabled?: boolean;
  /**
   * Adds logo offset, e.g. `{top: 8, left: 8}` will put the logo in top-left corner of the map
   */
  logoPosition?:
    | {top?: number; left?: number}
    | {top?: number; right?: number}
    | {bottom?: number; left?: number}
    | {bottom?: number; right?: number};
  /**
   * Enable/Disable the compass from appearing on the map
   */
  compassEnabled?: boolean;
  /**
   * Change corner of map the compass starts at. 0: TopLeft, 1: TopRight, 2: BottomLeft, 3: BottomRight
   */
  compassViewPosition?: number;
  /**
   * Add margins to the compass with x and y values
   */
  compassViewMargins?: object;
  /**
   * [Android only] Enable/Disable use of GLSurfaceView insted of TextureView.
   */
  surfaceView?: boolean;
  /**
   * Map press listener, gets called when a user presses the map
   */
  onPress?(feature: GeoJSON.Feature): void;
  /**
   * Map long press listener, gets called when a user long presses the map
   */
  onLongPress?(feature: GeoJSON.Feature): void;
  /**
   * This event is triggered whenever the currently displayed map region is about to change.
   *
   * @param {PointFeature} feature - The geojson point feature at the camera center, properties contains zoomLevel, visibleBounds
   */
  onRegionWillChange?(
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ): void;
  /**
   * This event is triggered whenever the currently displayed map region is changing.
   *
   * @param {PointFeature} feature - The geojson point feature at the camera center, properties contains zoomLevel, visibleBounds
   */
  onRegionIsChanging?(
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ): void;
  /**
   * This event is triggered whenever the currently displayed map region finished changing
   *
   * @param {PointFeature} feature - The geojson point feature at the camera center, properties contains zoomLevel, visibleBounds
   */
  onRegionDidChange?(
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ): void;
  /**
   * This event is triggered when the map is about to start loading a new map style.
   */
  onWillStartLoadingMap?(): void;
  /**
   * This is triggered when the map has successfully loaded a new map style.
   */
  onDidFinishLoadingMap?(): void;
  /**
   * This event is triggered when the map has failed to load a new map style.
   */
  onDidFailLoadingMap?(): void;
  /**
   * This event is triggered when the map will start rendering a frame.
   */
  onWillStartRenderingFrame?(): void;
  /**
   * This event is triggered when the map finished rendering a frame.
   */
  onDidFinishRenderingFrame?(): void;
  /**
   * This event is triggered when the map fully finished rendering a frame.
   */
  onDidFinishRenderingFrameFully?(): void;
  /**
   * This event is triggered when the map will start rendering the map.
   */
  onWillStartRenderingMap?(): void;
  /**
   * This event is triggered when the map finished rendering the map.
   */
  onDidFinishRenderingMap?(): void;
  /**
   * This event is triggered when the map fully finished rendering the map.
   */
  onDidFinishRenderingMapFully?(): void;
  /**
   * This event is triggered when the user location is updated.
   */
  onUserLocationUpdate?: (location: Location) => void;
  /**
   * This event is triggered when a style has finished loading.
   */
  onDidFinishLoadingStyle?(): void;
  /**
   * The emitted frequency of regionwillchange events
   */
  regionWillChangeDebounceTime?: number;
  /**
   * The emitted frequency of regiondidchange events
   */
  regionDidChangeDebounceTime?: number;

  children: ReactNode;
}

type Fn = (...args: any) => any;
type CallableProps = {
  [Prop in keyof MapViewProps]-?: MapViewProps[Prop] extends Fn | undefined
    ? Prop
    : never;
}[keyof MapViewProps];

interface NativeProps extends Omit<MapViewProps, 'onPress' | 'onLongPress'> {
  onPress(event: NativeSyntheticEvent<{payload: GeoJSON.Feature}>): void;
  onLongPress(event: NativeSyntheticEvent<{payload: GeoJSON.Feature}>): void;
}

export interface MapViewRef {
  getPointInView: (coordinate: GeoJSON.Position) => Promise<GeoJSON.Point>;
  getCoordinateFromView: (point: number[]) => Promise<GeoJSON.Position>;
  getVisibleBounds: () => Promise<VisibleBounds>;
  queryRenderedFeaturesAtPoint: (
    point: [screenPointX: number, screenPointY: number],
    filter: FilterExpression | undefined,
    layerIDs: string[],
  ) => Promise<GeoJSON.FeatureCollection>;
  queryRenderedFeaturesInRect: (
    bbox: GeoJSON.BBox,
    filter: FilterExpression | undefined,
    layerIDs: string[],
  ) => Promise<GeoJSON.FeatureCollection>;
  setCamera: () => void;
  takeSnap: (writeToDisk?: boolean) => Promise<string>;
  getZoom: () => Promise<number>;
  getCenter: () => Promise<GeoJSON.Position>;
  setSourceVisibility: (
    visible: boolean,
    sourceId: string,
    sourceLayerId?: string | null,
  ) => void;
  showAttribution: () => Promise<void>;
  setNativeProps: (props: NativeProps) => void;
}

/**
 * MapView backed by MapLibre GL Native
 */

const MapView = memo(
  React.forwardRef<MapViewRef, MapViewProps>(
    (
      {
        localizeLabels = false,
        scrollEnabled = true,
        pitchEnabled = true,
        rotateEnabled = true,
        attributionEnabled = true,
        logoEnabled = false,
        surfaceView = false,
        regionWillChangeDebounceTime = 10,
        regionDidChangeDebounceTime = 500,
        ...props
      }: MapViewProps,
      ref,
    ) => {
      // * exposes the methods of the function component so we don't break projects that depend on calling this methods
      useImperativeHandle(
        ref,
        (): MapViewRef => ({
          /**
           * Converts a geographic coordinate to a point in the given view’s coordinate system.
           *
           * @example
           * const pointInView = await this._map.getPointInView([-37.817070, 144.949901]);
           *
           * @param {Array<Number>} coordinate - A point expressed in the map view's coordinate system.
           * @return {Array}
           */
          getPointInView,
          /**
           * Converts a point in the given view’s coordinate system to a geographic coordinate.
           *
           * @example
           * const coordinate = await this._map.getCoordinateFromView([100, 100]);
           *
           * @param {Array<Number>} point - A point expressed in the given view’s coordinate system.
           * @return {Array}
           */
          getCoordinateFromView,
          /**
           * The coordinate bounds(ne, sw) visible in the users’s viewport.
           *
           * @example
           * const visibleBounds = await this._map.getVisibleBounds();
           *
           * @return {Array}
           */
          getVisibleBounds,
          /**
           * Returns an array of rendered map features that intersect with a given point.
           *
           * @example
           * this._map.queryRenderedFeaturesAtPoint([30, 40], ['==', 'type', 'Point'], ['id1', 'id2'])
           *
           * @param  {Array<Number>} coordinate - A point expressed in the map view’s coordinate system.
           * @param  {Array=} filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
           * @param  {Array=} layerIDs - A array of layer id's to filter the features by
           * @return {GeoJSON.FeatureCollection}
           */
          queryRenderedFeaturesAtPoint,
          /**
           * Returns an array of rendered map features that intersect with the given rectangle,
           * restricted to the given style layers and filtered by the given predicate.
           *
           * @example
           * this._map.queryRenderedFeaturesInRect([30, 40, 20, 10], ['==', 'type', 'Point'], ['id1', 'id2'])
           *
           * @param  {Array<Number>} bbox - A rectangle expressed in the map view’s coordinate system.
           * @param  {Array=} filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
           * @param  {Array=} layerIDs -  A array of layer id's to filter the features by
           * @return {GeoJSON.FeatureCollection}
           */
          queryRenderedFeaturesInRect,
          /**
           * Map camera will perform updates based on provided config. Deprecated use Camera#setCamera.
           */
          setCamera,
          /**
           * Takes snapshot of map with current tiles and returns a URI to the image
           * @param  {Boolean} writeToDisk If true will create a temp file, otherwise it is in base64
           * @return {String}
           */
          takeSnap,
          /**
           * Returns the current zoom of the map view.
           *
           * @example
           * const zoom = await this._map.getZoom();
           *
           * @return {Number}
           */
          getZoom,
          /**
           * Returns the map's geographical centerpoint
           *
           * @example
           * const center = await this._map.getCenter();
           *
           * @return {Array<Number>} Coordinates
           */
          getCenter,
          /**
           * Sets the visibility of all the layers referencing the specified `sourceLayerId` and/or `sourceId`
           *
           * @example
           * await this._map.setSourceVisibility(false, 'composite', 'building')
           *
           * @param {boolean} visible - Visibility of the layers
           * @param {String} sourceId - Identifier of the target source (e.g. 'composite')
           * @param {String=} sourceLayerId - Identifier of the target source-layer (e.g. 'building')
           */
          setSourceVisibility,
          /**
           * Show the attribution and telemetry action sheet.
           * If you implement a custom attribution button, you should add this action to the button.
           */
          showAttribution,
          setNativeProps,
        }),
      );

      const {_runNativeCommand, _runPendingNativeCommands, _onAndroidCallback} =
        useNativeBridge(NATIVE_MODULE_NAME);
      const logger = useRef<Logger>(Logger.sharedInstance());
      // * start the logger before anyuseEffect
      useOnce(() => {
        logger.current.start();
      });
      const _nativeRef = useRef<RCTMLNMapViewRefType>();
      const [isReady, setIsReady] = useState(false);

      // Cleanups on unmount
      useEffect(() => {
        const currentLogger = logger.current;

        return (): void => {
          _onDebouncedRegionWillChange.clear();
          _onDebouncedRegionDidChange.clear();
          currentLogger.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // This will run on every render
      // so similar to componentDidMount and UNSAFE_componentWillReceiveProps
      useEffect(() => {
        _setHandledMapChangedEvents(props);
      }, [props]);

      const _setHandledMapChangedEvents = (props: MapViewProps): void => {
        if (isAndroid()) {
          const events = [];

          if (props.onRegionWillChange) {
            events.push(MapLibreGL.EventTypes.RegionWillChange);
          }
          if (props.onRegionIsChanging) {
            events.push(MapLibreGL.EventTypes.RegionIsChanging);
          }
          if (props.onRegionDidChange) {
            events.push(MapLibreGL.EventTypes.RegionDidChange);
          }
          if (props.onUserLocationUpdate) {
            events.push(MapLibreGL.EventTypes.UserLocationUpdated);
          }
          if (props.onWillStartLoadingMap) {
            events.push(MapLibreGL.EventTypes.WillStartLoadingMap);
          }
          if (props.onDidFinishLoadingMap) {
            events.push(MapLibreGL.EventTypes.DidFinishLoadingMap);
          }
          if (props.onDidFailLoadingMap) {
            events.push(MapLibreGL.EventTypes.DidFailLoadingMap);
          }
          if (props.onWillStartRenderingFrame) {
            events.push(MapLibreGL.EventTypes.WillStartRenderingFrame);
          }
          if (props.onDidFinishRenderingFrame) {
            events.push(MapLibreGL.EventTypes.DidFinishRenderingFrame);
          }
          if (props.onDidFinishRenderingFrameFully) {
            events.push(MapLibreGL.EventTypes.DidFinishRenderingFrameFully);
          }
          if (props.onWillStartRenderingMap) {
            events.push(MapLibreGL.EventTypes.WillStartRenderingMap);
          }
          if (props.onDidFinishRenderingMap) {
            events.push(MapLibreGL.EventTypes.DidFinishRenderingMap);
          }
          if (props.onDidFinishRenderingMapFully) {
            events.push(MapLibreGL.EventTypes.DidFinishRenderingMapFully);
          }
          if (props.onDidFinishLoadingStyle) {
            events.push(MapLibreGL.EventTypes.DidFinishLoadingStyle);
          }

          _runNativeCommand(
            'setHandledMapChangedEvents',
            _nativeRef.current,
            events,
          );
        }
      };

      const getPointInView = async (
        coordinate: GeoJSON.Position,
      ): Promise<GeoJSON.Point> => {
        const res: {pointInView: GeoJSON.Point} = await _runNativeCommand(
          'getPointInView',
          _nativeRef.current,
          [coordinate],
        );
        return res.pointInView;
      };

      const getCoordinateFromView = async (
        point: number[],
      ): Promise<GeoJSON.Position> => {
        const res: {coordinateFromView: GeoJSON.Position} =
          await _runNativeCommand('getCoordinateFromView', _nativeRef.current, [
            point,
          ]);
        return res.coordinateFromView;
      };

      const getVisibleBounds = async (): Promise<VisibleBounds> => {
        const res: {visibleBounds: VisibleBounds} = await _runNativeCommand(
          'getVisibleBounds',
          _nativeRef.current,
        );
        return res.visibleBounds;
      };

      const queryRenderedFeaturesAtPoint = async (
        point: [screenPointX: number, screenPointY: number],
        filter?: FilterExpression,
        layerIDs: string[] = [],
      ): Promise<GeoJSON.FeatureCollection> => {
        if (!point || point.length < 2) {
          throw new Error(
            "Must pass in valid point in the map view's cooridnate system[x, y]",
          );
        }

        const res: {data: string | GeoJSON.FeatureCollection} =
          await _runNativeCommand(
            'queryRenderedFeaturesAtPoint',
            _nativeRef.current,
            [point, getFilter(filter), layerIDs],
          );

        if (isAndroid()) {
          return JSON.parse(res.data as string);
        }

        return res.data as GeoJSON.FeatureCollection;
      };

      const queryRenderedFeaturesInRect = async (
        bbox: GeoJSON.BBox,
        filter?: FilterExpression,
        layerIDs: string[] = [],
      ): Promise<GeoJSON.FeatureCollection> => {
        if (!bbox || bbox.length !== 4) {
          throw new Error(
            'Must pass in a valid bounding box[top, right, bottom, left]',
          );
        }
        const res: {data: string | GeoJSON.FeatureCollection} =
          await _runNativeCommand(
            'queryRenderedFeaturesInRect',
            _nativeRef.current,
            [bbox, getFilter(filter), layerIDs],
          );

        if (isAndroid()) {
          return JSON.parse(res.data as string);
        }

        return res.data as GeoJSON.FeatureCollection;
      };

      const setCamera = (): void => {
        console.warn(
          'MapView.setCamera is deprecated - please use Camera#setCamera',
        );
      };

      const takeSnap = async (writeToDisk = false): Promise<string> => {
        const res: {uri: string} = await _runNativeCommand(
          'takeSnap',
          _nativeRef.current,
          [writeToDisk],
        );
        return res.uri;
      };

      const getZoom = async (): Promise<number> => {
        const res: {zoom: number} = await _runNativeCommand(
          'getZoom',
          _nativeRef.current,
        );
        return res.zoom;
      };

      const getCenter = async (): Promise<GeoJSON.Position> => {
        const res: {center: GeoJSON.Position} = await _runNativeCommand(
          'getCenter',
          _nativeRef.current,
        );
        return res.center;
      };

      const setSourceVisibility = (
        visible: boolean,
        sourceId: string,
        sourceLayerId: string | null = null,
      ): void => {
        _runNativeCommand('setSourceVisibility', _nativeRef.current, [
          visible,
          sourceId,
          sourceLayerId,
        ]);
      };

      const showAttribution = async (): Promise<void> => {
        _runNativeCommand('showAttribution', _nativeRef.current);
      };

      const _onPress = (
        e: NativeSyntheticEvent<{payload: GeoJSON.Feature}>,
      ): void => {
        if (isFunction(props.onPress)) {
          props.onPress(e.nativeEvent.payload);
        }
      };

      const _onLongPress = (
        e: NativeSyntheticEvent<{payload: GeoJSON.Feature}>,
      ): void => {
        if (isFunction(props.onLongPress)) {
          props.onLongPress(e.nativeEvent.payload);
        }
      };

      const _onRegionWillChange = (
        payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
      ): void => {
        if (isFunction(props.onRegionWillChange)) {
          props.onRegionWillChange(payload);
        }
      };

      const _onRegionDidChange = (
        payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
      ): void => {
        if (isFunction(props.onRegionDidChange)) {
          props.onRegionDidChange(payload);
        }
      };

      const _onDebouncedRegionWillChange = useCallback(
        debounce(_onRegionWillChange, regionWillChangeDebounceTime, {
          immediate: true,
        }),
        [_onRegionWillChange],
      );

      const _onDebouncedRegionDidChange = useCallback(
        debounce(_onRegionDidChange, regionDidChangeDebounceTime),
        [_onRegionDidChange],
      );

      const _onChange = (
        e: NativeSyntheticEvent<{
          type: string;
          payload?: GeoJSON.Feature | Location;
        }>,
      ): void => {
        const {type, payload} = e.nativeEvent;
        let propName: CallableProps | undefined;

        switch (type) {
          case MapLibreGL.EventTypes.RegionWillChange:
            if (
              regionWillChangeDebounceTime &&
              regionWillChangeDebounceTime > 0
            ) {
              if (payload) {
                _onDebouncedRegionWillChange(
                  payload as GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
                );
              }
            } else {
              propName = 'onRegionWillChange';
            }
            break;
          case MapLibreGL.EventTypes.RegionIsChanging:
            propName = 'onRegionIsChanging';
            break;
          case MapLibreGL.EventTypes.RegionDidChange:
            if (
              regionDidChangeDebounceTime &&
              regionDidChangeDebounceTime > 0
            ) {
              if (payload) {
                _onDebouncedRegionDidChange(
                  payload as GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
                );
              }
            } else {
              propName = 'onRegionDidChange';
            }
            break;
          case MapLibreGL.EventTypes.UserLocationUpdated:
            propName = 'onUserLocationUpdate';
            break;
          case MapLibreGL.EventTypes.WillStartLoadingMap:
            propName = 'onWillStartLoadingMap';
            break;
          case MapLibreGL.EventTypes.DidFinishLoadingMap:
            propName = 'onDidFinishLoadingMap';
            break;
          case MapLibreGL.EventTypes.DidFailLoadingMap:
            propName = 'onDidFailLoadingMap';
            break;
          case MapLibreGL.EventTypes.WillStartRenderingFrame:
            propName = 'onWillStartRenderingFrame';
            break;
          case MapLibreGL.EventTypes.DidFinishRenderingFrame:
            propName = 'onDidFinishRenderingFrame';
            break;
          case MapLibreGL.EventTypes.DidFinishRenderingFrameFully:
            propName = 'onDidFinishRenderingFrameFully';
            break;
          case MapLibreGL.EventTypes.WillStartRenderingMap:
            propName = 'onWillStartRenderingMap';
            break;
          case MapLibreGL.EventTypes.DidFinishRenderingMap:
            propName = 'onDidFinishRenderingMap';
            break;
          case MapLibreGL.EventTypes.DidFinishRenderingMapFully:
            propName = 'onDidFinishRenderingMapFully';
            break;
          case MapLibreGL.EventTypes.DidFinishLoadingStyle:
            propName = 'onDidFinishLoadingStyle';
            break;
          default:
            console.warn('Unhandled event callback type', type);
        }

        if (propName) {
          _handleOnChange(propName, payload);
        }
      };

      const _onLayout = (): void => {
        setIsReady(true);
      };

      const _handleOnChange = <T extends CallableProps>(
        propName: T,
        payload?: object,
      ): void => {
        const callable = props[propName] as (payload?: object) => void;
        if (callable && isFunction(callable)) {
          callable(payload);
        }
      };

      const contentInsetValue = useMemo(() => {
        if (!props.contentInset) {
          return;
        }

        if (!Array.isArray(props.contentInset)) {
          return [props.contentInset];
        }

        return props.contentInset;
      }, [props.contentInset]);

      const _setNativeRef = (nativeRef: RCTMLNMapViewRefType): void => {
        _nativeRef.current = nativeRef;
        _runPendingNativeCommands(nativeRef);
      };

      const setNativeProps = (props: NativeProps): void => {
        if (_nativeRef.current) {
          _nativeRef.current.setNativeProps(props);
        }
      };

      const _setStyleURL = (props: MapViewProps): void => {
        // user set a styleURL, no need to alter props
        if (props.styleURL) {
          return;
        }

        // user set styleJSON pass it to styleURL
        if (props.styleJSON && !props.styleURL) {
          props.styleURL = props.styleJSON;
        }

        // user neither set styleJSON nor styleURL
        // set defaultStyleUrl
        if (!props.styleJSON || !props.styleURL) {
          props.styleURL = defaultStyleURL;
        }
      };

      const nativeProps = useMemo(() => {
        return {
          ...props,
          localizeLabels,
          scrollEnabled,
          pitchEnabled,
          rotateEnabled,
          attributionEnabled,
          logoEnabled,
          surfaceView,
          regionWillChangeDebounceTime,
          regionDidChangeDebounceTime,
          contentInsetValue,
          style: styles.matchParent,
        };
      }, [
        localizeLabels,
        scrollEnabled,
        pitchEnabled,
        rotateEnabled,
        attributionEnabled,
        logoEnabled,
        surfaceView,
        regionWillChangeDebounceTime,
        regionDidChangeDebounceTime,
        contentInsetValue,
        props,
        contentInsetValue,
      ]);

      _setStyleURL(nativeProps);

      const callbacks = {
        ref: (ref: RCTMLNMapViewRefType): void => _setNativeRef(ref),
        onPress: _onPress,
        onLongPress: _onLongPress,
        onMapChange: _onChange,
        onAndroidCallback: isAndroid() ? _onAndroidCallback : undefined,
      };

      let mapView: ReactElement | null = null;
      if (isAndroid() && !surfaceView && isReady) {
        mapView = (
          <RCTMLNAndroidTextureMapView {...nativeProps} {...callbacks}>
            {props.children}
          </RCTMLNAndroidTextureMapView>
        );
      } else if (isReady) {
        mapView = (
          <RCTMLNMapView {...nativeProps} {...callbacks}>
            {props.children}
          </RCTMLNMapView>
        );
      }

      return (
        <View
          onLayout={_onLayout}
          style={props.style}
          testID={mapView ? undefined : props.testID}>
          {mapView}
        </View>
      );
    },
  ),
);

type RCTMLNMapViewRefType = Component<NativeProps> & Readonly<NativeMethods>;
const RCTMLNMapView = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

let RCTMLNAndroidTextureMapView: typeof RCTMLNMapView;
if (isAndroid()) {
  RCTMLNAndroidTextureMapView = requireNativeComponent<NativeProps>(
    ANDROID_TEXTURE_NATIVE_MODULE_NAME,
  );
}
export default MapView;
