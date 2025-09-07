import {
  Component,
  type ComponentProps,
  forwardRef,
  memo,
  type ReactElement,
  type ReactNode,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  findNodeHandle as rnFindNodeHandle,
  type HostComponent,
  type NativeMethods,
  NativeModules,
  type NativeSyntheticEvent,
  requireNativeComponent,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import NativeMapViewComponent, {
  type NativeProps,
} from "./NativeMapViewComponent";
import NativeMapViewModule from "./NativeMapViewModule";
import { type BaseProps } from "../../types/BaseProps";
import type { Bounds } from "../../types/Bounds";
import { type FilterExpression } from "../../types/MapLibreRNStyles";
import type { ViewPadding } from "../../types/ViewPadding";
import { isAndroid } from "../../utils";
import { Logger } from "../../utils/Logger";
import { getFilter } from "../../utils/filterUtils";

const MLRNModule = NativeModules.MLRNModule;
if (MLRNModule == null) {
  console.error(
    "Native module of @maplibre/maplibre-react-native library was not registered properly, please consult the docs: https://github.com/maplibre/maplibre-react-native",
  );
}

const MLRNAndroidTextureMapViewComponent = isAndroid()
  ? (requireNativeComponent<NativeProps>(
      "MLRNAndroidTextureMapView",
    ) as HostComponent<NativeProps>)
  : undefined;

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

export type OrnamentViewPosition =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };

export type PressEvent = {
  longitude: number;

  latitude: number;

  /**
   * Touch origin X coordinate inside touchable area (relative to the element).
   */
  locationX: number;

  /**
   * Touch origin Y coordinate inside touchable area (relative to the element).
   */
  locationY: number;
};

export type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  bounds: Bounds;
};

export type ViewStateChangeEvent = ViewState & {
  animated: boolean;
  userInteraction: boolean;
};

export interface MapViewRef {
  /**
   * Returns the current center coordinates of the map
   *
   * @example
   * await mapViewRef.current?.getCenter();
   *
   * @return Current center coordinates of the map
   */
  getCenter(): Promise<Pick<ViewState, "longitude" | "latitude">>;

  /**
   * Returns the current zoom level of the map
   *
   * @example
   * await mapViewRef.current?.getZoom();
   *
   * @return Current zoom level of the map
   */
  getZoom(): Promise<ViewState["zoom"]>;

  /**
   * Returns the current bearing of the map
   *
   * @example
   * await mapViewRef.current?.getBearing();
   *
   * @return Current bearing of the map
   */
  getBearing(): Promise<ViewState["bearing"]>;

  /**
   * Returns the current pitch of the map
   *
   * @example
   * await mapViewRef.current?.getPitch();
   *
   * @return Current pitch of the map
   */
  getPitch(): Promise<ViewState["pitch"]>;

  /**
   * Returns the current bounds of the map
   *
   * @example
   * await mapViewRef.current?.getBounds();
   *
   * @return Current bounds of the map
   */
  getBounds(): Promise<ViewState["bounds"]>;

  /**
   * Returns the current view state of the map
   *
   * @example
   * await mapViewRef.current?.getViewState();
   *
   * @return Current view state of the map
   */
  getViewState(): Promise<ViewState>;

  /**
   * Converts a geographic coordinate to a pixel point of the view
   *
   * @example
   * await mapViewRef.current?.getPointInView([-37.817070, 144.949901]);
   *
   * @param coordinate Geographic coordinate
   * @return Pixel point
   */
  getPointInView(
    coordinate: [longitude: number, latitude: number],
  ): Promise<[x: number, y: number]>;

  /**
   * Converts a pixel point of the view to a geographic coordinate.
   *
   * @example
   * await mapViewRef.current?.getCoordinateFromView([100, 100]);
   *
   * @param point Pixel point
   * @return Geographic coordinate
   */
  getCoordinateFromView(
    point: [x: number, y: number],
  ): Promise<[longitude: number, latitude: number]>;

  /**
   * Returns an array of rendered map features that intersect with a given point.
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeaturesAtPoint([30, 40], ['==', 'type', 'Point'], ['id1', 'id2'])
   *
   * @param point - A point expressed in the map view’s coordinate system.
   * @param filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
   * @param layerIds - A array of layer id's to filter the features by
   * @return FeatureCollection containing queried features
   */
  queryRenderedFeaturesAtPoint(
    point: [screenPointX: number, screenPointY: number],
    filter?: FilterExpression,
    layerIds?: string[],
  ): Promise<GeoJSON.FeatureCollection>;

  /**
   * Returns an array of rendered map features that intersect with the given rectangle,
   * restricted to the given style layers and filtered by the given predicate.
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeaturesInRect([30, 40, 20, 10], ['==', 'type', 'Point'], ['id1', 'id2'])
   *
   * @param bbox - A rectangle expressed in the map view’s coordinate system.
   * @param filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
   * @param layerIds -  A array of layer id's to filter the features by
   * @return FeatureCollection containing queried features
   */
  queryRenderedFeaturesInRect(
    bbox: [number, number, number, number],
    filter?: FilterExpression,
    layerIds?: string[],
  ): Promise<GeoJSON.FeatureCollection>;

  /**
   * Takes snapshot of map with current tiles and returns a URI to the image
   * @param writeToDisk If true will create a temp file, otherwise it is in base64
   * @return URL of snapshot file or base64 encoded image
   */
  takeSnap(writeToDisk?: boolean): Promise<string>;

  /**
   * Sets the visibility of all the layers referencing the specified `sourceLayerId` and/or `sourceId`
   *
   * @example
   * await mapViewRef.current?.setSourceVisibility(false, 'composite', 'building')
   *
   * @param visible - Visibility of the layers
   * @param sourceId - Identifier of the target source (e.g. 'composite')
   * @param sourceLayerId - Identifier of the target source-layer (e.g. 'building')
   */
  setSourceVisibility(
    visible: boolean,
    sourceId: string,
    sourceLayerId?: string,
  ): Promise<void>;

  /**
   * Show the attribution action sheet, can be used to implement a
   * custom attribution button
   */
  showAttribution(): Promise<void>;

  setNativeProps(props: NativeProps): void;
}

interface MapViewProps extends BaseProps {
  children?: ReactNode;

  /**
   * Style for wrapping React Native View
   */
  style?: ViewProps["style"];

  /**
   * The map's Maplibre style - either a URL or a Style JSON (https://maplibre.org/maplibre-style-spec/).
   *
   * @default "https://demotiles.maplibre.org/style.json"
   */
  mapStyle?: string | object;

  /**
   * The distance from the edges of the map view’s frame to the edges of the map view’s logical viewport.
   */
  contentInset?: ViewPadding;

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
   * Toggle scroll interaction of the map
   *
   * @default true
   */
  scroll?: boolean;

  /**
   * Toggle zoom interaction of the map
   *
   * @default true
   */
  zoom?: boolean;

  /**
   * Toggle rotation interaction of the map
   *
   * @default true
   */
  rotate?: boolean;

  /**
   * Toggle pitch interaction of the map
   *
   * @default true
   */
  pitch?: boolean;

  /**
   * Tints UI elements like the attribution button
   */
  tintColor?: string;

  /**
   * Toggle the attribution button of the map
   */
  attribution?: boolean;

  /**
   * Positions the attribution button
   *
   * @example Position in the top-left corner
   * { top: 8, left: 8 }
   */
  attributionPosition?: OrnamentViewPosition;

  /**
   * Toggle the logo on the map
   */
  logo?: boolean;

  /**
   * Positions the logo
   *
   * @example Position in the top-left corner
   * { top: 8, left: 8 }
   */
  logoPosition?: OrnamentViewPosition;

  /**
   * Toggle the compass from appearing on the map
   */
  compass?: boolean;

  /**
   * Positions the compass
   *
   * @example Position in the top-left corner
   * { top: 8, left: 8 }
   */
  compassPosition?: OrnamentViewPosition;

  /**
   * Android only: Switch between TextureView (default) and GLSurfaceView for
   * rendering the map
   *
   * @default "surface"
   */
  androidViewMode?: "surface" | "texture";

  /**
   * Called when a user presses the map
   */
  onPress?: (event: NativeSyntheticEvent<PressEvent>) => void;

  /**
   * Called when a user long presses the map
   */
  onLongPress?: (event: NativeSyntheticEvent<PressEvent>) => void;

  /**
   * Called when the currently displayed map region is about to change
   */
  onRegionWillChange?: (
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void;

  /**
   * Called when the currently displayed map region is changing
   */
  onRegionIsChanging?: (
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void;

  /**
   * Called when the currently displayed map region finished changing
   */
  onRegionDidChange?: (
    event: NativeSyntheticEvent<ViewStateChangeEvent>,
  ) => void;

  /**
   * Called when the map is about to start loading a new map style
   */
  onWillStartLoadingMap?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map has successfully loaded a new map style
   */
  onDidFinishLoadingMap?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map has failed to load a new map style
   */
  onDidFailLoadingMap?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map will start rendering a frame
   */
  onWillStartRenderingFrame?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map finished rendering a frame
   */
  onDidFinishRenderingFrame?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map fully finished rendering a frame
   */
  onDidFinishRenderingFrameFully?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map will start rendering itself
   */
  onWillStartRenderingMap?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map has finished rendering itself
   */
  onDidFinishRenderingMap?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Called when the map has fully finished rendering itself
   */
  onDidFinishRenderingMapFully?: (event: NativeSyntheticEvent<null>) => void;

  /**
   * Triggered when a style has finished loading
   */
  onDidFinishLoadingStyle?: (event: NativeSyntheticEvent<null>) => void;
}

/**
 * MapLibre Native MapView
 */
export const MapView = memo(
  forwardRef<MapViewRef, MapViewProps>(
    ({ androidViewMode = "surface", style, testID, ...props }, ref) => {
      const [isReady, setIsReady] = useState(false);

      const nativeRef = useRef<
        Component<ComponentProps<typeof NativeMapViewComponent>> &
          Readonly<NativeMethods>
      >(null);

      useImperativeHandle(ref, () => ({
        getCenter: () =>
          NativeMapViewModule.getCenter(findNodeHandle(nativeRef.current)),

        getZoom: () =>
          NativeMapViewModule.getZoom(findNodeHandle(nativeRef.current)),

        getBearing: () =>
          NativeMapViewModule.getBearing(findNodeHandle(nativeRef.current)),

        getPitch: () =>
          NativeMapViewModule.getPitch(findNodeHandle(nativeRef.current)),

        getBounds: () =>
          NativeMapViewModule.getBounds(
            findNodeHandle(nativeRef.current),
          ) as Promise<Bounds>,

        getViewState: () =>
          NativeMapViewModule.getViewState(
            findNodeHandle(nativeRef.current),
          ) as Promise<ViewState>,

        getPointInView: (coordinate) =>
          NativeMapViewModule.getPointInView(
            findNodeHandle(nativeRef.current),
            coordinate,
          ),

        getCoordinateFromView: (point) =>
          NativeMapViewModule.getCoordinateFromView(
            findNodeHandle(nativeRef.current),
            point,
          ),

        queryRenderedFeaturesAtPoint: (point, filter, layerIds = []) =>
          NativeMapViewModule.queryRenderedFeaturesAtPoint(
            findNodeHandle(nativeRef.current),
            point,
            layerIds,
            getFilter(filter),
          ) as Promise<GeoJSON.FeatureCollection>,

        queryRenderedFeaturesInRect: (bbox, filter, layerIds = []) =>
          NativeMapViewModule.queryRenderedFeaturesInRect(
            findNodeHandle(nativeRef.current),
            bbox,
            layerIds,
            getFilter(filter),
          ) as Promise<GeoJSON.FeatureCollection>,

        takeSnap: (writeToDisk = false) =>
          NativeMapViewModule.takeSnap(
            findNodeHandle(nativeRef.current),
            writeToDisk,
          ),

        setSourceVisibility: (visible, sourceId, sourceLayerId) =>
          NativeMapViewModule.setSourceVisibility(
            findNodeHandle(nativeRef.current),
            visible,
            sourceId,
            sourceLayerId ?? null,
          ),

        showAttribution: () =>
          NativeMapViewModule.showAttribution(
            findNodeHandle(nativeRef.current),
          ),

        setNativeProps: (props) => nativeRef.current?.setNativeProps(props),
      }));

      // Start before rendering
      useLayoutEffect(() => {
        Logger.sharedInstance().start();

        return () => {
          Logger.sharedInstance().stop();
        };
      }, []);

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

      let mapView: ReactElement | null = null;
      if (isReady) {
        if (
          MLRNAndroidTextureMapViewComponent &&
          androidViewMode === "texture"
        ) {
          mapView = (
            <MLRNAndroidTextureMapViewComponent {...nativeProps}>
              {props.children}
            </MLRNAndroidTextureMapViewComponent>
          );
        } else {
          mapView = (
            <NativeMapViewComponent {...nativeProps}>
              {props.children}
            </NativeMapViewComponent>
          );
        }
      }

      return (
        <View
          onLayout={() => setIsReady(true)}
          style={style}
          testID={mapView ? undefined : testID}
        >
          {mapView}
        </View>
      );
    },
  ),
);
