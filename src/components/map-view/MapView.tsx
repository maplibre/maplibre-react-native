import {
  Component,
  type ComponentProps,
  forwardRef,
  memo,
  type ReactElement,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  findNodeHandle as rnFindNodeHandle,
  type NativeMethods,
  NativeModules,
  type NativeSyntheticEvent,
  requireNativeComponent,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import NativeMapViewComponent, {
  type ViewPadding,
  type ViewPosition,
  type ViewState,
} from "./NativeMapViewComponent";
import NativeMapViewModule from "./NativeMapViewModule";
import { useNativeBridge } from "../../hooks/useNativeBridge";
import { useOnce } from "../../hooks/useOnce";
import { type BaseProps } from "../../types/BaseProps";
import { type FilterExpression } from "../../types/MapLibreRNStyles";
import { isAndroid } from "../../utils";
import { Logger } from "../../utils/Logger";
import { getFilter } from "../../utils/filterUtils";
import NativeCameraComponent from "../camera/NativeCameraComponent";

const MLRNModule = NativeModules.MLRNModule;
if (MLRNModule == null) {
  console.error(
    "Native module of @maplibre/maplibre-react-native library was not registered properly, please consult the docs: https://github.com/maplibre/maplibre-react-native",
  );
}

export const NATIVE_MODULE_NAME = "MLRNMapView";

export const ANDROID_TEXTURE_NATIVE_MODULE_NAME = "MLRNAndroidTextureMapView";

const styles = StyleSheet.create({
  matchParent: { flex: 1 },
});

const findNodeHandle = (ref: Component | null) => {
  const nodeHandle = rnFindNodeHandle(ref);

  if (!nodeHandle) {
    throw new Error(
      "NativeMapViewComponent ref is null, wait for the map being initialized",
    );
  }

  return nodeHandle;
};

type VisibleBounds = [west: number, south: number, east: number, north: number];

interface MapViewProps extends BaseProps {
  children?: ReactNode;
  /**
   * The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport.
   */
  contentInset?: ViewPadding;
  /**
   * Style for wrapping React Native View
   */
  style?: ViewProps["style"];
  /**
   * Style for map - either a URL or a Style JSON (https://maplibre.org/maplibre-style-spec/). Default: `StyleURL.Default`
   */
  mapStyle?: string | object;
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
   * Tints UI elements like the attribution button
   */
  tintColor?: string;

  /**
   * Enable/Disable attribution on map
   */
  attribution?: boolean;
  /**
   * Positions the attribution
   *
   * @example
   * { top: 8, left: 8 } // Position in the top-left corner
   */
  attributionPosition?: ViewPosition;

  /**
   * Enable/Disable the logo on the map.
   */
  logo?: boolean;
  /**
   * Positions the logo
   *
   * @example
   * { top: 8, left: 8 } // Position in the top-left corner
   */
  logoPosition?: ViewPosition;

  /**
   * Enable/Disable the compass from appearing on the map
   */
  compass?: boolean;
  /**
   * Positions the compass
   *
   * @example
   * { top: 8, left: 8 } // Position in the top-left corner
   */
  compassPosition?: ViewPosition;

  /**
   * [Android only] Enable/Disable use of GLSurfaceView instead of TextureView
   *
   * @default "surface"
   */
  androidViewMode?: "surface" | "texture";
  /**
   * Map press listener, gets called when a user presses the map
   */
  onPress?: (feature: GeoJSON.Feature) => void;
  /**
   * Map long press listener, gets called when a user long presses the map
   */
  onLongPress?: (feature: GeoJSON.Feature) => void;
  /**
   * Called when the currently displayed map region is about to change
   */
  onRegionWillChange?: (feature: NativeSyntheticEvent<ViewState>) => void;
  /**
   * Called when the currently displayed map region is changing
   */
  onRegionIsChanging?: (feature: NativeSyntheticEvent<ViewState>) => void;
  /**
   * Called when the currently displayed map region finished changing
   */
  onRegionDidChange?: (feature: NativeSyntheticEvent<ViewState>) => void;
  /**
   * Called when the map is about to start loading a new map style
   */
  onWillStartLoadingMap?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map has successfully loaded a new map style
   */
  onDidFinishLoadingMap?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map has failed to load a new map style
   */
  onDidFailLoadingMap?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map will start rendering a frame
   */
  onWillStartRenderingFrame?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map finished rendering a frame
   */
  onDidFinishRenderingFrame?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map fully finished rendering a frame
   */
  onDidFinishRenderingFrameFully?: (
    event: NativeSyntheticEvent<object>,
  ) => void;
  /**
   * Called when the map will start rendering itself
   */
  onWillStartRenderingMap?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map has finished rendering itself
   */
  onDidFinishRenderingMap?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Called when the map has fully finished rendering itself
   */
  onDidFinishRenderingMapFully?: (event: NativeSyntheticEvent<object>) => void;
  /**
   * Triggered when a style has finished loading
   */
  onDidFinishLoadingStyle?: (event: NativeSyntheticEvent<object>) => void;
}

interface NativeProps extends Omit<MapViewProps, "onPress" | "onLongPress"> {
  mapStyle?: string;
  onPress(event: NativeSyntheticEvent<{ payload: GeoJSON.Feature }>): void;
  onLongPress(event: NativeSyntheticEvent<{ payload: GeoJSON.Feature }>): void;
}

export interface MapViewRef {
  getPointInView: (
    coordinate: [longitude: number, latitude: number],
  ) => Promise<[x: number, y: number]>;
  getCoordinateFromView: (
    point: [x: number, y: number],
  ) => Promise<[longitude: number, latitude: number]>;
  getVisibleBounds: () => Promise<VisibleBounds>;
  queryRenderedFeaturesAtPoint: (
    point: [screenPointX: number, screenPointY: number],
    filter?: FilterExpression,
    layerIds?: string[],
  ) => Promise<GeoJSON.FeatureCollection>;
  queryRenderedFeaturesInRect: (
    bbox: [number, number, number, number],
    filter?: FilterExpression,
    layerIds?: string[],
  ) => Promise<GeoJSON.FeatureCollection>;
  takeSnap: (writeToDisk?: boolean) => Promise<string>;
  getZoom: () => Promise<number>;
  getCenter: () => Promise<[longitude: number, latitude: number]>;
  setSourceVisibility: (
    visible: boolean,
    sourceId: string,
    sourceLayerId?: string,
  ) => Promise<void>;
  showAttribution: () => Promise<void>;
  setNativeProps: (props: NativeProps) => void;
}

/**
 * MapView backed by MapLibre Native
 */
export const MapView = memo(
  forwardRef<MapViewRef, MapViewProps>(
    (
      { androidViewMode = "surface", style, testID, ...props }: MapViewProps,
      ref,
    ) => {
      const [isReady, setIsReady] = useState(false);

      const nativeRef = useRef<
        Component<ComponentProps<typeof NativeCameraComponent>> &
          Readonly<NativeMethods>
      >(null);

      useImperativeHandle(
        ref,
        (): MapViewRef => ({
          /**
           * Converts a geographic coordinate to a pixel point of the view.
           *
           * @example
           * const pointInView = await mapViewRef.current?.getPointInView([-37.817070, 144.949901]);
           *
           * @param {[longitude: number, latitude: number]} coordinate Geographic coordinate
           * @return {[x: number, y: number]} Pixel point
           */
          getPointInView,
          /**
           * Converts a pixel point of the view to a geographic coordinate.
           *
           * @example
           * const coordinate = await mapViewRef.current?.getCoordinateFromView([100, 100]);
           *
           * @param {[x: number, y: number]} point Pixel point
           * @return {[longitude: number, latitude: number]} Geographic coordinate
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
           * @param  {number[]} coordinate - A point expressed in the map view’s coordinate system.
           * @param  {Array=} filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
           * @param  {Array=} layerIds - A array of layer id's to filter the features by
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
           * @param  {[number, number, number, number]} bbox - A rectangle expressed in the map view’s coordinate system.
           * @param  {Array=} filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
           * @param  {Array=} layerIds -  A array of layer id's to filter the features by
           * @return {GeoJSON.FeatureCollection}
           */
          queryRenderedFeaturesInRect,
          /**
           * Takes snapshot of map with current tiles and returns a URI to the image
           * @param  {boolean} writeToDisk If true will create a temp file, otherwise it is in base64
           * @return {string}
           */
          takeSnap,
          /**
           * Returns the current zoom of the map view.
           *
           * @example
           * const zoom = await this._map.getZoom();
           *
           * @return {number}
           */
          getZoom,
          /**
           * Returns the map's geographical centerpoint
           *
           * @example
           * const center = await this._map.getCenter();
           *
           * @return {number[]} Coordinates
           */
          getCenter,
          /**
           * Sets the visibility of all the layers referencing the specified `sourceLayerId` and/or `sourceId`
           *
           * @example
           * await this._map.setSourceVisibility(false, 'composite', 'building')
           *
           * @param {boolean} visible - Visibility of the layers
           * @param {string} sourceId - Identifier of the target source (e.g. 'composite')
           * @param {string=} sourceLayerId - Identifier of the target source-layer (e.g. 'building')
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

      const {
        _runNativeCommand,
        _runPendingNativeCommands,
        _onAndroidCallback,
      } = useNativeBridge(NATIVE_MODULE_NAME);

      const logger = useRef<Logger>(Logger.sharedInstance());
      // Start the logger before any useEffect
      useOnce(() => {
        logger.current.start();
      });

      // Cleanups on unmount
      useEffect(() => {
        const currentLogger = logger.current;

        return (): void => {
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
            events.push(MLRNModule.EventTypes.RegionWillChange);
          }
          if (props.onRegionIsChanging) {
            events.push(MLRNModule.EventTypes.RegionIsChanging);
          }
          if (props.onRegionDidChange) {
            events.push(MLRNModule.EventTypes.RegionDidChange);
          }
          if (props.onWillStartLoadingMap) {
            events.push(MLRNModule.EventTypes.WillStartLoadingMap);
          }
          if (props.onDidFinishLoadingMap) {
            events.push(MLRNModule.EventTypes.DidFinishLoadingMap);
          }
          if (props.onDidFailLoadingMap) {
            events.push(MLRNModule.EventTypes.DidFailLoadingMap);
          }
          if (props.onWillStartRenderingFrame) {
            events.push(MLRNModule.EventTypes.WillStartRenderingFrame);
          }
          if (props.onDidFinishRenderingFrame) {
            events.push(MLRNModule.EventTypes.DidFinishRenderingFrame);
          }
          if (props.onDidFinishRenderingFrameFully) {
            events.push(MLRNModule.EventTypes.DidFinishRenderingFrameFully);
          }
          if (props.onWillStartRenderingMap) {
            events.push(MLRNModule.EventTypes.WillStartRenderingMap);
          }
          if (props.onDidFinishRenderingMap) {
            events.push(MLRNModule.EventTypes.DidFinishRenderingMap);
          }
          if (props.onDidFinishRenderingMapFully) {
            events.push(MLRNModule.EventTypes.DidFinishRenderingMapFully);
          }
          if (props.onDidFinishLoadingStyle) {
            events.push(MLRNModule.EventTypes.DidFinishLoadingStyle);
          }

          _runNativeCommand(
            "setHandledMapChangedEvents",
            nativeRef.current,
            events,
          );
        }
      };

      const getPointInView = async (
        coordinate: [longitude: number, latitude: number],
      ) =>
        NativeMapViewModule.getPointInView(
          findNodeHandle(nativeRef.current),
          coordinate,
        );

      const getCoordinateFromView = async (point: [x: number, y: number]) => {
        return NativeMapViewModule.getCoordinateFromView(
          findNodeHandle(nativeRef.current),
          point,
        );
      };

      const getVisibleBounds = async (): Promise<VisibleBounds> =>
        NativeMapViewModule.getVisibleBounds(findNodeHandle(nativeRef.current));

      const queryRenderedFeaturesAtPoint = async (
        point: [screenPointX: number, screenPointY: number],
        filter?: FilterExpression,
        layerIds: string[] = [],
      ) => {
        return (await NativeMapViewModule.queryRenderedFeaturesAtPoint(
          findNodeHandle(nativeRef.current),
          point,
          layerIds,
          getFilter(filter),
        )) as GeoJSON.FeatureCollection;
      };

      const queryRenderedFeaturesInRect = async (
        bbox: [number, number, number, number],
        filter?: FilterExpression,
        layerIds: string[] = [],
      ) =>
        (await NativeMapViewModule.queryRenderedFeaturesInRect(
          findNodeHandle(nativeRef.current),
          bbox,
          layerIds,
          getFilter(filter),
        )) as GeoJSON.FeatureCollection;

      const takeSnap = async (writeToDisk = false) =>
        NativeMapViewModule.takeSnap(
          findNodeHandle(nativeRef.current),
          writeToDisk,
        );

      const getZoom = () =>
        NativeMapViewModule.getZoom(findNodeHandle(nativeRef.current));

      const getCenter = () =>
        NativeMapViewModule.getCenter(findNodeHandle(nativeRef.current));

      const setSourceVisibility = (
        visible: boolean,
        sourceId: string,
        sourceLayerId?: string,
      ) =>
        NativeMapViewModule.setSourceVisibility(
          findNodeHandle(nativeRef.current),
          visible,
          sourceId,
          sourceLayerId ?? null,
        );

      const showAttribution = async () =>
        NativeMapViewModule.showAttribution(findNodeHandle(nativeRef.current));

      const handleOnLayout = () => {
        setIsReady(true);
      };

      const _setNativeRef = (nativeRef: MLRNMapViewRefType): void => {
        nativeRef.current = nativeRef;
        _runPendingNativeCommands(nativeRef);
      };

      const setNativeProps = (props: NativeProps): void => {
        if (nativeRef.current) {
          nativeRef.current.setNativeProps(props);
        }
      };

      const nativeProps = useMemo(() => {
        const { mapStyle, ...otherProps } = props;

        let nativeMapStyle = undefined;
        if (mapStyle) {
          if (typeof mapStyle === "string") {
            nativeMapStyle = mapStyle;
          } else if (typeof mapStyle === "object") {
            nativeMapStyle = JSON.stringify(mapStyle);
          }
        }

        return {
          ...otherProps,
          ref: nativeRef,
          style: styles.matchParent,
          mapStyle: nativeMapStyle,
        };
      }, [props]);

      const callbacks = {
        onAndroidCallback: isAndroid() ? _onAndroidCallback : undefined,
      };

      let mapView: ReactElement | null = null;
      if (isReady) {
        if (isAndroid() && androidViewMode === "texture") {
          mapView = (
            <MLRNAndroidTextureMapView {...nativeProps} {...callbacks}>
              {props.children}
            </MLRNAndroidTextureMapView>
          );
        } else {
          mapView = (
            <NativeMapViewComponent {...nativeProps} {...callbacks}>
              {props.children}
            </NativeMapViewComponent>
          );
        }
      }

      return (
        <View
          onLayout={handleOnLayout}
          style={style}
          testID={mapView ? undefined : testID}
        >
          {mapView}
        </View>
      );
    },
  ),
);

type MLRNMapViewRefType = Component<NativeProps> & Readonly<NativeMethods>;

let MLRNAndroidTextureMapView: typeof NativeMapViewComponent;
if (isAndroid()) {
  MLRNAndroidTextureMapView = requireNativeComponent<NativeProps>(
    ANDROID_TEXTURE_NATIVE_MODULE_NAME,
  );
}
