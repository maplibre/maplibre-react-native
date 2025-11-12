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

import MapViewNativeComponent, {
  type NativeProps,
} from "./MapViewNativeComponent";
import NativeMapViewModule from "./NativeMapViewModule";
import { Logger } from "../../modules/Logger";
import { type BaseProps } from "../../types/BaseProps";
import type { Bounds } from "../../types/Bounds";
import {
  type FilterExpression,
  type LightLayerStyle,
} from "../../types/MapLibreRNStyles";
import type { PressEvent } from "../../types/PressEvent";
import type { ViewPadding } from "../../types/ViewPadding";
import { isAndroid } from "../../utils";
import { transformStyle } from "../../utils/StyleValue";
import { getFilter } from "../../utils/filterUtils";

const MLRNModule = NativeModules.MLRNModule;
if (MLRNModule == null) {
  console.error(
    "Native module of @maplibre/maplibre-react-native library was not registered properly, please consult the docs: https://github.com/maplibre/maplibre-react-native",
  );
}

const NativeAndroidTextureMapViewComponent = isAndroid()
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
      "MapViewNativeComponent ref is null, wait for the map being initialized",
    );
  }

  return nodeHandle;
};

export type OrnamentViewPosition =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };

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

export type QueryRenderedFeaturesOptions = {
  filter?: FilterExpression;
  layers?: string[];
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
  project(coordinate: {
    longitude: number;
    latitude: number;
  }): Promise<{ locationX: number; locationY: number }>;

  /**
   * Converts a pixel point of the view to a geographic coordinate.
   *
   * @example
   * await mapViewRef.current?.getCoordinateFromView([100, 100]);
   *
   * @param point Pixel point
   * @return Geographic coordinate
   */
  unproject(point: {
    locationX: number;
    locationY: number;
  }): Promise<{ longitude: number; latitude: number }>;

  /**
   * Returns an array of rendered map features.
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeaturesAtPoint([30, 40], ['==', 'type', 'Point'], ['id1', 'id2'])
   *
   * @param options.filter - A set of strings that correspond to the names of layers defined in the current style. Only the features contained in these layers are included in the returned array.
   * @param options.layers - A array of layer id's to filter the features by
   * @return FeatureCollection containing queried features
   */
  queryRenderedFeatures(
    coordinate: { longitude: number; latitude: number },
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.FeatureCollection>;
  queryRenderedFeatures(
    bounds: Bounds,
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.FeatureCollection>;
  queryRenderedFeatures(
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.FeatureCollection>;

  /**
   * Takes snapshot of map with current tiles and returns a URI to the image
   * @param writeToDisk If true will create a temp file, otherwise it is in base64
   * @return URL of snapshot file or base64 encoded image
   */
  takeSnap(writeToDisk?: boolean): Promise<string>;

  /**
   * Sets the visibility of all the layers referencing the specified `source` and optionally `sourceLayer`
   *
   * @example
   * await mapViewRef.current?.setSourceVisibility(false, 'composite', 'building')
   *
   * @param visible - Visibility of the layers
   * @param source - Identifier of the target source (e.g. 'composite')
   * @param sourceLayer - Identifier of the target source-layer (e.g. 'building')
   */
  setSourceVisibility(
    visible: boolean,
    source: string,
    sourceLayer?: string,
  ): Promise<void>;

  /**
   * Show the attribution action sheet, can be used to implement a
   * custom attribution button
   */
  showAttribution(): Promise<void>;
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
   * Light properties of the style. Must conform to the Light Style Specification.
   * Controls the light source for extruded geometries.
   *
   * @example
   * light={{ position: [1.5, 90, 80], color: "#ffffff", intensity: 0.5 }}
   */
  light?: LightLayerStyle;

  /**
   * The distance from the edges of the map view's frame to the edges of the map view's logical viewport.
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
   * Toggle pan interaction of the map
   *
   * @default true
   */
  dragPan?: boolean;

  /**
   * Toggle zoom interaction of the map
   *
   * @default true
   */
  touchAndDoubleTapZoom?: boolean;

  /**
   * Toggle rotate interaction of the map
   *
   * @default true
   */
  touchRotate?: boolean;

  /**
   * Toggle pitch interaction of the map
   *
   * @default true
   */
  touchPitch?: boolean;

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
  androidView?: "surface" | "texture";

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
    ({ androidView = "surface", style, testID, ...props }, ref) => {
      const [isReady, setIsReady] = useState(false);

      const nativeRef = useRef<
        Component<ComponentProps<typeof MapViewNativeComponent>> &
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

        project: (coordinate) =>
          NativeMapViewModule.project(
            findNodeHandle(nativeRef.current),
            coordinate,
          ),

        unproject: (point) =>
          NativeMapViewModule.unproject(
            findNodeHandle(nativeRef.current),
            point,
          ),

        queryRenderedFeatures: async (
          geometryOrOptions?:
            | { longitude: number; latitude: number }
            | Bounds
            | QueryRenderedFeaturesOptions,
          options?: QueryRenderedFeaturesOptions,
        ) => {
          if (
            geometryOrOptions &&
            "longitude" in geometryOrOptions &&
            "latitude" in geometryOrOptions
          ) {
            return (await NativeMapViewModule.queryRenderedFeaturesWithCoordinate(
              findNodeHandle(nativeRef.current),
              geometryOrOptions,
              options?.layers ?? [],
              getFilter(options?.filter),
            )) as GeoJSON.FeatureCollection;
          } else if (Array.isArray(geometryOrOptions)) {
            return (await NativeMapViewModule.queryRenderedFeaturesWithBounds(
              findNodeHandle(nativeRef.current),
              geometryOrOptions,
              options?.layers ?? [],
              getFilter(options?.filter),
            )) as GeoJSON.FeatureCollection;
          } else {
            return (await NativeMapViewModule.queryRenderedFeaturesWithBounds(
              findNodeHandle(nativeRef.current),
              // TODO: Solve this natively
              await NativeMapViewModule.getBounds(
                findNodeHandle(nativeRef.current),
              ),
              options?.layers ?? [],
              getFilter(options?.filter),
            )) as GeoJSON.FeatureCollection;
          }
        },

        takeSnap: (writeToDisk = false) =>
          NativeMapViewModule.takeSnap(
            findNodeHandle(nativeRef.current),
            writeToDisk,
          ),

        setSourceVisibility: (visible, source, sourceLayer) =>
          NativeMapViewModule.setSourceVisibility(
            findNodeHandle(nativeRef.current),
            visible,
            source,
            sourceLayer ?? null,
          ),

        showAttribution: () =>
          NativeMapViewModule.showAttribution(
            findNodeHandle(nativeRef.current),
          ),
      }));

      // Start before rendering
      useLayoutEffect(() => {
        Logger.sharedInstance().start();

        return () => {
          Logger.sharedInstance().stop();
        };
      }, []);

      const nativeProps = useMemo(() => {
        const { mapStyle, light, ...otherProps } = props;

        let nativeMapStyle = undefined;
        if (mapStyle) {
          if (typeof mapStyle === "string") {
            nativeMapStyle = mapStyle;
          } else if (typeof mapStyle === "object") {
            nativeMapStyle = JSON.stringify(mapStyle);
          }
        }

        const transformedLight = props.light
          ? transformStyle(props.light)
          : undefined;

        return {
          ...otherProps,
          ref: nativeRef,
          style: styles.matchParent,
          mapStyle: nativeMapStyle,
          light: transformedLight,
        };
      }, [props]);

      let mapView: ReactElement | null = null;
      if (isReady) {
        if (NativeAndroidTextureMapViewComponent && androidView === "texture") {
          mapView = <NativeAndroidTextureMapViewComponent {...nativeProps} />;
        } else {
          mapView = <MapViewNativeComponent {...nativeProps} />;
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
