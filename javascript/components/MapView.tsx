import {FilterExpression} from '../utils/MaplibreStyles';
import {Location} from '../modules/location/locationManager';
import {isFunction, isAndroid} from '../utils';
import {getFilter} from '../utils/filterUtils';
import Logger from '../utils/Logger';
import BaseProps from '../types/BaseProps';

import NativeBridgeComponent from './NativeBridgeComponent';

import React, {Component, ReactElement, ReactNode} from 'react';
import {
  View,
  StyleSheet,
  NativeModules,
  requireNativeComponent,
  ViewProps,
  NativeMethods,
  LayoutChangeEvent,
  NativeSyntheticEvent,
} from 'react-native';
import debounce from 'debounce';

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
  visibleBounds: GeoJSON.Position[];
  pitch: number;
}

interface Bounds {
  ne: GeoJSON.Position;
  sw: GeoJSON.Position;
}

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
    | {
        top?: number;
        left?: number;
      }
    | {
        top?: number;
        right?: number;
      }
    | {
        bottom?: number;
        left?: number;
      }
    | {
        bottom?: number;
        right?: number;
      };
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
    | {
        top?: number;
        left?: number;
      }
    | {
        top?: number;
        right?: number;
      }
    | {
        bottom?: number;
        left?: number;
      }
    | {
        bottom?: number;
        right?: number;
      };
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

export interface MapViewState {
  isReady: boolean;
  width: number;
  height: number;
  region: RegionPayload | null;
  isUserInteraction: boolean;
}

/**
 * MapView backed by MapLibre GL Native
 */
class MapView extends NativeBridgeComponent(
  React.Component<MapViewProps, MapViewState>,
  NATIVE_MODULE_NAME,
) {
  static defaultProps = {
    localizeLabels: false,
    scrollEnabled: true,
    pitchEnabled: true,
    rotateEnabled: true,
    attributionEnabled: true,
    logoEnabled: false,
    surfaceView: false,
    regionWillChangeDebounceTime: 10,
    regionDidChangeDebounceTime: 500,
  };

  logger: Logger;
  _nativeRef?: RCTMLNMapViewRefType;
  _onDebouncedRegionWillChange: ReturnType<typeof debounce>;
  _onDebouncedRegionDidChange: ReturnType<typeof debounce>;

  constructor(props: MapViewProps) {
    super(props);

    this.logger = Logger.sharedInstance();
    this.logger.start();

    this.state = {
      isReady: false,
      region: null,
      width: 0,
      height: 0,
      isUserInteraction: false,
    };

    this._onPress = this._onPress.bind(this);
    this._onLongPress = this._onLongPress.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onLayout = this._onLayout.bind(this);

    // debounced map change methods
    this._onDebouncedRegionWillChange = debounce(
      this._onRegionWillChange.bind(this),
      props.regionWillChangeDebounceTime,
      true,
    );

    this._onDebouncedRegionDidChange = debounce(
      this._onRegionDidChange.bind(this),
      props.regionDidChangeDebounceTime,
    );
  }

  componentDidMount(): void {
    this._setHandledMapChangedEvents(this.props);
  }

  componentWillUnmount(): void {
    this._onDebouncedRegionWillChange.clear();
    this._onDebouncedRegionDidChange.clear();
    this.logger.stop();
  }

  UNSAFE_componentWillReceiveProps(nextProps: MapViewProps): void {
    this._setHandledMapChangedEvents(nextProps);
  }

  _setHandledMapChangedEvents(props: MapViewProps): void {
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

      this._runNativeCommand(
        'setHandledMapChangedEvents',
        this._nativeRef,
        events,
      );
    }
  }

  /**
   * Converts a geographic coordinate to a point in the given view’s coordinate system.
   *
   * @example
   * const pointInView = await this._map.getPointInView([-37.817070, 144.949901]);
   *
   * @param {Array<Number>} coordinate - A point expressed in the map view's coordinate system.
   * @return {Array}
   */
  async getPointInView(coordinate: GeoJSON.Position): Promise<GeoJSON.Point> {
    const res: {pointInView: GeoJSON.Point} = await this._runNativeCommand(
      'getPointInView',
      this._nativeRef,
      [coordinate],
    );
    return res.pointInView;
  }

  /**
   * Converts a point in the given view’s coordinate system to a geographic coordinate.
   *
   * @example
   * const coordinate = await this._map.getCoordinateFromView([100, 100]);
   *
   * @param {Array<Number>} point - A point expressed in the given view’s coordinate system.
   * @return {Array}
   */
  async getCoordinateFromView(point: number[]): Promise<GeoJSON.Position> {
    const res: {coordinateFromView: GeoJSON.Position} =
      await this._runNativeCommand('getCoordinateFromView', this._nativeRef, [
        point,
      ]);
    return res.coordinateFromView;
  }

  /**
   * The coordinate bounds(ne, sw) visible in the users’s viewport.
   *
   * @example
   * const visibleBounds = await this._map.getVisibleBounds();
   *
   * @return {Array}
   */
  async getVisibleBounds(): Promise<Bounds> {
    const res: {visibleBounds: Bounds} = await this._runNativeCommand(
      'getVisibleBounds',
      this._nativeRef,
    );
    return res.visibleBounds;
  }

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
  async queryRenderedFeaturesAtPoint(
    coordinate: GeoJSON.Position,
    filter?: FilterExpression,
    layerIDs = [],
  ): Promise<GeoJSON.FeatureCollection> {
    if (!coordinate || coordinate.length < 2) {
      throw new Error('Must pass in valid coordinate[lng, lat]');
    }

    const res: {data: string | GeoJSON.FeatureCollection} =
      await this._runNativeCommand(
        'queryRenderedFeaturesAtPoint',
        this._nativeRef,
        [coordinate, getFilter(filter), layerIDs],
      );

    if (isAndroid()) {
      return JSON.parse(res.data as string);
    }

    return res.data as GeoJSON.FeatureCollection;
  }

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
  async queryRenderedFeaturesInRect(
    bbox: GeoJSON.BBox,
    filter?: FilterExpression,
    layerIDs = [],
  ): Promise<GeoJSON.FeatureCollection> {
    if (!bbox || bbox.length !== 4) {
      throw new Error(
        'Must pass in a valid bounding box[top, right, bottom, left]',
      );
    }
    const res: {data: string | GeoJSON.FeatureCollection} =
      await this._runNativeCommand(
        'queryRenderedFeaturesInRect',
        this._nativeRef,
        [bbox, getFilter(filter), layerIDs],
      );

    if (isAndroid()) {
      return JSON.parse(res.data as string);
    }

    return res.data as GeoJSON.FeatureCollection;
  }

  /**
   * Map camera will perform updates based on provided config. Deprecated use Camera#setCamera.
   */
  setCamera(): void {
    console.warn(
      'MapView.setCamera is deprecated - please use Camera#setCamera',
    );
  }

  /**
   * Takes snapshot of map with current tiles and returns a URI to the image
   * @param  {Boolean} writeToDisk If true will create a temp file, otherwise it is in base64
   * @return {String}
   */
  async takeSnap(writeToDisk = false): Promise<string> {
    const res: {uri: string} = await this._runNativeCommand(
      'takeSnap',
      this._nativeRef,
      [writeToDisk],
    );
    return res.uri;
  }

  /**
   * Returns the current zoom of the map view.
   *
   * @example
   * const zoom = await this._map.getZoom();
   *
   * @return {Number}
   */

  async getZoom(): Promise<number> {
    const res: {zoom: number} = await this._runNativeCommand(
      'getZoom',
      this._nativeRef,
    );
    return res.zoom;
  }

  /**
   * Returns the map's geographical centerpoint
   *
   * @example
   * const center = await this._map.getCenter();
   *
   * @return {Array<Number>} Coordinates
   */
  async getCenter(): Promise<GeoJSON.Position> {
    const res: {center: GeoJSON.Position} = await this._runNativeCommand(
      'getCenter',
      this._nativeRef,
    );
    return res.center;
  }

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
  setSourceVisibility(
    visible: boolean,
    sourceId: string,
    sourceLayerId: string | null = null,
  ): void {
    this._runNativeCommand('setSourceVisibility', this._nativeRef, [
      visible,
      sourceId,
      sourceLayerId,
    ]);
  }

  /**
   * Show the attribution and telemetry action sheet.
   * If you implement a custom attribution button, you should add this action to the button.
   */
  async showAttribution(): Promise<void> {
    this._runNativeCommand('showAttribution', this._nativeRef);
  }

  _onPress(e: NativeSyntheticEvent<{payload: GeoJSON.Feature}>): void {
    if (isFunction(this.props.onPress)) {
      this.props.onPress(e.nativeEvent.payload);
    }
  }

  _onLongPress(e: NativeSyntheticEvent<{payload: GeoJSON.Feature}>): void {
    if (isFunction(this.props.onLongPress)) {
      this.props.onLongPress(e.nativeEvent.payload);
    }
  }

  _onRegionWillChange(
    payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ): void {
    if (isFunction(this.props.onRegionWillChange)) {
      this.props.onRegionWillChange(payload);
    }
    this.setState({isUserInteraction: payload.properties.isUserInteraction});
  }

  _onRegionDidChange(
    payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ): void {
    if (isFunction(this.props.onRegionDidChange)) {
      this.props.onRegionDidChange(payload);
    }
    this.setState({region: payload});
  }

  _onChange(
    e: NativeSyntheticEvent<{
      type: string;
      payload?: GeoJSON.Feature | Location;
    }>,
  ): void {
    const {regionWillChangeDebounceTime, regionDidChangeDebounceTime} =
      this.props;
    const {type, payload} = e.nativeEvent;
    let propName: CallableProps | undefined;

    switch (type) {
      case MapLibreGL.EventTypes.RegionWillChange:
        if (regionWillChangeDebounceTime && regionWillChangeDebounceTime > 0) {
          this._onDebouncedRegionWillChange(payload);
        } else {
          propName = 'onRegionWillChange';
        }
        break;
      case MapLibreGL.EventTypes.RegionIsChanging:
        propName = 'onRegionIsChanging';
        break;
      case MapLibreGL.EventTypes.RegionDidChange:
        if (regionDidChangeDebounceTime && regionDidChangeDebounceTime > 0) {
          this._onDebouncedRegionDidChange(payload);
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
      this._handleOnChange(propName, payload);
    }
  }

  _onLayout(e: LayoutChangeEvent): void {
    this.setState({
      isReady: true,
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }

  _handleOnChange<T extends CallableProps>(
    propName: T,
    payload?: object,
  ): void {
    const callable = this.props[propName] as (payload?: object) => void;
    if (callable && isFunction(callable)) {
      callable(payload);
    }
  }

  _getContentInset(): number[] | undefined {
    if (!this.props.contentInset) {
      return;
    }

    if (!Array.isArray(this.props.contentInset)) {
      return [this.props.contentInset];
    }

    return this.props.contentInset;
  }

  _setNativeRef(nativeRef: RCTMLNMapViewRefType): void {
    this._nativeRef = nativeRef;
    super._runPendingNativeCommands(nativeRef);
  }

  setNativeProps(props: NativeProps): void {
    if (this._nativeRef) {
      this._nativeRef.setNativeProps(props);
    }
  }

  _setStyleURL(props: MapViewProps): void {
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
  }

  render(): ReactElement {
    const props = {
      ...this.props,
      contentInset: this._getContentInset(),
      style: styles.matchParent,
    };

    this._setStyleURL(props);

    const callbacks = {
      ref: (ref: RCTMLNMapViewRefType) => this._setNativeRef(ref),
      onPress: this._onPress,
      onLongPress: this._onLongPress,
      onMapChange: this._onChange,
      onAndroidCallback: isAndroid() ? this._onAndroidCallback : undefined,
    };

    let mapView: ReactElement | null = null;
    if (isAndroid() && !this.props.surfaceView && this.state.isReady) {
      mapView = (
        <RCTMLNAndroidTextureMapView {...props} {...callbacks}>
          {this.props.children}
        </RCTMLNAndroidTextureMapView>
      );
    } else if (this.state.isReady) {
      mapView = (
        <RCTMLNMapView {...props} {...callbacks}>
          {this.props.children}
        </RCTMLNMapView>
      );
    }

    return (
      <View
        onLayout={this._onLayout}
        style={this.props.style}
        testID={mapView ? undefined : this.props.testID}>
        {mapView}
      </View>
    );
  }
}

type RCTMLNMapViewRefType = Component<NativeProps> & Readonly<NativeMethods>;
const RCTMLNMapView = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

let RCTMLNAndroidTextureMapView: typeof RCTMLNMapView;
if (isAndroid()) {
  RCTMLNAndroidTextureMapView = requireNativeComponent<NativeProps>(
    ANDROID_TEXTURE_NATIVE_MODULE_NAME,
  );
}
export default MapView;
