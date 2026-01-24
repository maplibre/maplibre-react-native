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
  type NativeMethods,
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import AndroidTextureMapViewNativeComponent from "./AndroidTextureMapViewNativeComponent";
import MapViewNativeComponent from "./MapViewNativeComponent";
import NativeMapViewModule from "./NativeMapViewModule";
import { LogManager } from "../../modules/log/LogManager";
import { type BaseProps } from "../../types/BaseProps";
import type { LngLat } from "../../types/LngLat";
import type { LngLatBounds } from "../../types/LngLatBounds";
import {
  type FilterExpression,
  type LightLayerStyle,
} from "../../types/MapLibreRNStyles";
import type { PixelPoint } from "../../types/PixelPoint";
import type { PixelPointBounds } from "../../types/PixelPointBounds";
import type { PressEvent } from "../../types/PressEvent";
import type { PressEventWithFeatures } from "../../types/PressEventWithFeatures";
import type { ViewPadding } from "../../types/ViewPadding";
import { transformStyle } from "../../utils/StyleValue";
import { findNodeHandle } from "../../utils/findNodeHandle";
import { getFilter } from "../../utils/getFilter";

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

export type OrnamentViewPosition =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };

export type ViewState = {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  bounds: LngLatBounds;
};

export type ViewStateChangeEvent = ViewState & {
  animated: boolean;
  userInteraction: boolean;
};

export type QueryRenderedFeaturesOptions = {
  /**
   * Filter expression to filter the queried features
   */
  filter?: FilterExpression;

  /**
   * IDs of layers to query features from
   */
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
  getCenter(): Promise<LngLat>;

  /**
   * Returns the current zoom level of the map
   *
   * @example
   * await mapViewRef.current?.getZoom();
   *
   * @return Current zoom level of the map
   */
  getZoom(): Promise<number>;

  /**
   * Returns the current bearing of the map
   *
   * @example
   * await mapViewRef.current?.getBearing();
   *
   * @return Current bearing of the map
   */
  getBearing(): Promise<number>;

  /**
   * Returns the current pitch of the map
   *
   * @example
   * await mapViewRef.current?.getPitch();
   *
   * @return Current pitch of the map
   */
  getPitch(): Promise<number>;

  /**
   * Returns the current bounds of the map
   *
   * @example
   * await mapViewRef.current?.getBounds();
   *
   * @return Current bounds of the map
   */
  getBounds(): Promise<LngLatBounds>;

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
   * Converts geographic coordinates to pixel point of the view
   *
   * @example
   * await mapViewRef.current?.getPointInView([-37.817070, 144.949901]);
   *
   * @param coordinates Geographic coordinate
   * @return Pixel point
   */
  project(coordinates: LngLat): Promise<PixelPoint>;

  /**
   * Converts a pixel point of the view to geographic coordinates.
   *
   * @example
   * await mapViewRef.current?.getCoordinateFromView([280, 640]);
   *
   * @param point Pixel point
   * @return Geographic coordinate
   */
  unproject(point: PixelPoint): Promise<LngLat>;

  /**
   * Query rendered features at a point
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeatures(
   *   [240, 640],
   *   {
   *     filter: ["==", "type", "Point"],
   *     layers: ["restaurants", "shops"],
   *   },
   * );
   *
   * @return Queried features
   */
  queryRenderedFeatures(
    pixelPoint: PixelPoint,
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Query rendered features within pixel bounds
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeatures(
   *   [100, 100, 400, 400],
   *   {
   *     filter: ["==", "type", "Point"],
   *     layers: ["restaurants", "shops"],
   *   },
   * );
   *
   * @return Queried features
   */
  queryRenderedFeatures(
    pixelPointBounds: PixelPointBounds,
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Query rendered features within the current viewport
   *
   * @example
   * await mapViewRef.current?.queryRenderedFeatures(
   *   {
   *     filter: ["==", "type", "Point"],
   *     layers: ["restaurants", "shops"],
   *   },
   * );
   *
   * @return Queried features
   */
  queryRenderedFeatures(
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Takes static-map image of the currently displayed map
   *
   * @param options.output Use "base64" to get a Base64 encoded string, or "file" to get a URI to an image file saved on disk
   *
   * @return Base64 encoded image or URI of image file
   */
  createStaticMapImage(options: { output: "base64" | "file" }): Promise<string>;

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
   * Show the attribution dialog
   *
   * Can be used to implement a custom attribution button.
   */
  showAttribution(): Promise<void>;
}

export interface MapViewProps extends BaseProps {
  children?: ReactNode;

  /**
   * Style for wrapping React Native View
   *
   * @default { flex: 1 }
   */
  style?: ViewProps["style"];

  /**
   * Maplibre style - either a URL or a Style JSON.
   *
   * @see https://maplibre.org/maplibre-style-spec/
   */
  mapStyle: string | object;

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
   * Toggle the compass from hiding when facing north
   *
   * @default true
   */
  compassHiddenFacingNorth?: boolean;

  /**
   * Android only: Switch between TextureView (default) and GLSurfaceView for
   * rendering the map
   *
   * @default "surface"
   */
  androidView?: "surface" | "texture";

  /**
   * Called when a user presses the map
   *
   * If the event bubbles up from a child `Source` with an `onPress` handler the
   * `features` will be included. The event will emit on `MapView` and `Source`.
   * To prevent this use `event.stopPropagation()` in the `Source` handler.
   */
  onPress?: (
    event:
      | NativeSyntheticEvent<PressEvent>
      | NativeSyntheticEvent<PressEventWithFeatures>,
  ) => void;

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
    ({ androidView = "surface", style, ...props }, ref) => {
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
          NativeMapViewModule.getBounds(findNodeHandle(nativeRef.current)),

        getViewState: () =>
          NativeMapViewModule.getViewState(
            findNodeHandle(nativeRef.current),
          ) as Promise<ViewState>,

        project: (lngLat) =>
          NativeMapViewModule.project(
            findNodeHandle(nativeRef.current),
            lngLat,
          ),

        unproject: (point) =>
          NativeMapViewModule.unproject(
            findNodeHandle(nativeRef.current),
            point,
          ),

        queryRenderedFeatures: async (
          pixelPointOrPixelPointBoundsOrOptions?:
            | PixelPoint
            | PixelPointBounds
            | QueryRenderedFeaturesOptions,
          options?: QueryRenderedFeaturesOptions,
        ) => {
          if (
            pixelPointOrPixelPointBoundsOrOptions &&
            Array.isArray(pixelPointOrPixelPointBoundsOrOptions) &&
            ((value: PixelPoint | PixelPointBounds): value is PixelPoint =>
              typeof value[0] === "number" && typeof value[1] === "number")(
              pixelPointOrPixelPointBoundsOrOptions,
            )
          ) {
            return await NativeMapViewModule.queryRenderedFeaturesWithPoint(
              findNodeHandle(nativeRef.current),
              pixelPointOrPixelPointBoundsOrOptions,
              options?.layers ?? [],
              getFilter(options?.filter) as string[],
            );
          } else if (
            pixelPointOrPixelPointBoundsOrOptions &&
            Array.isArray(pixelPointOrPixelPointBoundsOrOptions) &&
            ((
              value: PixelPoint | PixelPointBounds,
            ): value is PixelPointBounds =>
              Array.isArray(value[0]) && Array.isArray(value[1]))(
              pixelPointOrPixelPointBoundsOrOptions,
            )
          ) {
            return await NativeMapViewModule.queryRenderedFeaturesWithBounds(
              findNodeHandle(nativeRef.current),
              pixelPointOrPixelPointBoundsOrOptions,
              options?.layers ?? [],
              getFilter(options?.filter) as string[],
            );
          } else {
            return await NativeMapViewModule.queryRenderedFeaturesWithBounds(
              findNodeHandle(nativeRef.current),
              null,
              pixelPointOrPixelPointBoundsOrOptions?.layers ?? [],
              getFilter(
                pixelPointOrPixelPointBoundsOrOptions?.filter,
              ) as string[],
            );
          }
        },

        createStaticMapImage: (options) =>
          NativeMapViewModule.createStaticMapImage(
            findNodeHandle(nativeRef.current),
            options.output,
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
        LogManager.start();

        return () => {
          LogManager.stop();
        };
      }, []);

      const nativeProps = useMemo(() => {
        const { mapStyle, light, ...otherProps } = props;

        return {
          ...otherProps,
          ref: nativeRef,
          style: styles.flex1,
          mapStyle:
            typeof mapStyle === "object" ? JSON.stringify(mapStyle) : mapStyle,
          light: props.light ? transformStyle(props.light) : undefined,
        };
      }, [props]);

      let mapView: ReactElement | null = null;
      if (isReady) {
        const NativeMapView =
          Platform.OS === "android" && androidView === "texture"
            ? AndroidTextureMapViewNativeComponent
            : MapViewNativeComponent;

        mapView = <NativeMapView {...nativeProps} />;
      }

      return (
        <View
          onLayout={() => setIsReady(true)}
          style={style ?? styles.flex1}
          testID={nativeProps.testID ? `${nativeProps.testID}-view` : undefined}
        >
          {mapView}
        </View>
      );
    },
  ),
);
