import type {
  FilterSpecification,
  LightSpecification,
  StyleSpecification,
} from "@maplibre/maplibre-gl-style-spec";
import {
  Component,
  type ComponentProps,
  memo,
  type ReactElement,
  type Ref,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type NativeSyntheticEvent,
  Platform,
  type ReactNativeElement,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import AndroidTextureMapViewNativeComponent from "./AndroidTextureMapViewNativeComponent";
import MapViewNativeComponent from "./MapViewNativeComponent";
import NativeMapViewModule from "./NativeMapViewModule";
import { LogManager } from "../../modules/log/LogManager";
import type { BaseProps } from "../../types/BaseProps";
import type { LngLat } from "../../types/LngLat";
import type { LngLatBounds } from "../../types/LngLatBounds";
import type { PixelPoint } from "../../types/PixelPoint";
import type { PixelPointBounds } from "../../types/PixelPointBounds";
import type { PressEvent } from "../../types/PressEvent";
import type { PressEventWithFeatures } from "../../types/PressEventWithFeatures";
import type { ViewPadding } from "../../types/ViewPadding";
import { transformStyle } from "../../utils/StyleValue";
import { convertToInternalStyle } from "../../utils/convertStyleSpec";
import { findNodeHandle } from "../../utils/findNodeHandle";
import { getNativeFilter } from "../../utils/getNativeFilter";

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

/**
 * Screen position for map ornaments (logo, compass, scale bar). Exactly one of
 * `top` / `bottom` and one of `left` / `right` must be provided.
 */
export type OrnamentViewPosition =
  | { top: number; left: number }
  | { top: number; right: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number };

/**
 * Current viewport state of the map.
 */
export type ViewState = {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  bounds: LngLatBounds;
};

/**
 * Event emitted when the map viewport changes (pan, zoom, rotate, pitch).
 */
export type ViewStateChangeEvent = ViewState & {
  animated: boolean;
  userInteraction: boolean;
};

/**
 * Options for querying rendered features at a screen point or within a bounding
 * box.
 */
export type QueryRenderedFeaturesOptions = {
  /**
   * Filter expression to filter the queried features
   */
  filter?: FilterSpecification;

  /**
   * IDs of layers to query features from
   */
  layers?: string[];
};

export interface MapRef {
  /**
   * Returns the current center coordinates of the map
   *
   * @returns Current center coordinates of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getCenter();
   * ```
   */
  getCenter(): Promise<LngLat>;

  /**
   * Returns the current zoom level of the map
   *
   * @returns Current zoom level of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getZoom();
   * ```
   */
  getZoom(): Promise<number>;

  /**
   * Returns the current bearing of the map
   *
   * @returns Current bearing of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getBearing();
   * ```
   */
  getBearing(): Promise<number>;

  /**
   * Returns the current pitch of the map
   *
   * @returns Current pitch of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getPitch();
   * ```
   */
  getPitch(): Promise<number>;

  /**
   * Returns the current bounds of the map
   *
   * @returns Current bounds of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getBounds();
   * ```
   */
  getBounds(): Promise<LngLatBounds>;

  /**
   * Returns the current view state of the map
   *
   * @returns Current view state of the map
   *
   * @example
   * ```ts
   * await mapRef.current?.getViewState();
   * ```
   */
  getViewState(): Promise<ViewState>;

  /**
   * Converts geographic coordinates to pixel point of the view
   *
   * @param lngLat - Geographic coordinate
   * @returns Pixel point
   *
   * @example
   * ```ts
   * await mapRef.current?.project([13.04214014753952, 47.80554907882145]);
   * ```
   */
  project(lngLat: LngLat): Promise<PixelPoint>;

  /**
   * Converts a pixel point of the view to geographic coordinates.
   *
   * @param point - Pixel point
   * @returns Geographic coordinate
   *
   * @example
   * ```ts
   * await mapRef.current?.unproject([280, 640]);
   * ```
   */
  unproject(point: PixelPoint): Promise<LngLat>;

  /**
   * Query rendered features at a point
   *
   * @returns Queried features
   *
   * @example
   * ```ts
   * await mapRef.current?.queryRenderedFeatures([240, 640], {
   *   filter: ["==", "type", "Point"],
   *   layers: ["restaurants", "shops"],
   * });
   * ```
   */
  queryRenderedFeatures(
    pixelPoint: PixelPoint,
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Query rendered features within pixel bounds
   *
   * @returns Queried features
   *
   * @example
   * ```ts
   * await mapRef.current?.queryRenderedFeatures([100, 100, 400, 400], {
   *   filter: ["==", "type", "Point"],
   *   layers: ["restaurants", "shops"],
   * });
   * ```
   */
  queryRenderedFeatures(
    pixelPointBounds: PixelPointBounds,
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Query rendered features within the current viewport
   *
   * @returns Queried features
   *
   * @example
   * ```ts
   * await mapRef.current?.queryRenderedFeatures({
   *   filter: ["==", "type", "Point"],
   *   layers: ["restaurants", "shops"],
   * });
   * ```
   */
  queryRenderedFeatures(
    options?: QueryRenderedFeaturesOptions,
  ): Promise<GeoJSON.Feature[]>;

  /**
   * Takes static-map image of the currently displayed map
   *
   * @returns Base64 encoded image or URI of image file
   */
  createStaticMapImage(options: { output: "base64" | "file" }): Promise<string>;

  /**
   * Sets the visibility of all the layers referencing the specified `source` and
   * optionally `sourceLayer`
   *
   * @param visible - Visibility of the layers
   * @param source - Identifier of the target source (e.g. 'composite')
   * @param sourceLayer - Identifier of the target source-layer (e.g. 'building')
   *
   * @example
   * ```ts
   * await mapRef.current?.setSourceVisibility(false, "composite", "building");
   * ```
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

export interface MapProps extends BaseProps, ViewProps {
  /**
   * Style for wrapping React Native View
   *
   * @defaultValue { flex: 1 }
   */
  style?: ViewProps["style"];

  /**
   * Maplibre style - either a URL or a Style JSON.
   *
   * @see {@link https://maplibre.org/maplibre-style-spec/}
   */
  mapStyle: string | StyleSpecification;

  /**
   * Light properties of the style. Must conform to the Light Style Specification.
   * Controls the light source for extruded geometries.
   *
   * @example
   * ```tsx
   * light={{ position: [1.5, 90, 80], color: "#ffffff", intensity: 0.5 }}
   * ```
   */
  light?: LightSpecification;

  /**
   * The distance from the edges of the map view's frame to the edges of the map
   * view's logical viewport.
   */
  contentInset?: ViewPadding;

  /**
   * **iOS**: The preferred frame rate at which the map view is rendered. The
   * default value for this property is MLNMapViewPreferredFramesPerSecondDefault,
   * which will adaptively set the preferred frame rate based on the capability of
   * the user’s device to maintain a smooth experience. This property can be set
   * to arbitrary integer values.
   *
   * **Android**: The maximum frame rate at which the map view is rendered, but it
   * can't exceed the ability of device hardware. This property can be set to
   * arbitrary integer values.
   */
  preferredFramesPerSecond?: number;

  /**
   * Toggle pan interaction of the map
   *
   * @defaultValue true
   */
  dragPan?: boolean;

  /**
   * Toggle pinch/scroll zoom interaction of the map.
   *
   * On Android this also disables {@link doubleTapZoom} and {@link doubleTapHoldZoom}.
   *
   * @defaultValue true
   */
  touchZoom?: boolean;

  /**
   * Toggle double-tap zoom interaction of the map.
   *
   * @defaultValue true
   */
  doubleTapZoom?: boolean;

  /**
   * Toggle double-tap-and-hold zoom interaction of the map (also known as quick
   * zoom and one finger zoom).
   *
   * @defaultValue true
   */
  doubleTapHoldZoom?: boolean;

  /**
   * Toggle rotate interaction of the map
   *
   * @defaultValue true
   */
  touchRotate?: boolean;

  /**
   * Toggle pitch interaction of the map
   *
   * @defaultValue true
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
   * ```ts
   * { top: 8, left: 8 }
   * ```
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
   * ```ts
   * { top: 8, left: 8 }
   * ```
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
   * ```ts
   * { top: 8, left: 8 }
   * ```
   */
  compassPosition?: OrnamentViewPosition;

  /**
   * Toggle the compass from hiding when facing north
   *
   * @defaultValue true
   */
  compassHiddenFacingNorth?: boolean;

  /**
   * Toggle the scale bar on the map
   */
  scaleBar?: boolean;

  /**
   * Positions the scale bar. Android only supports top-left corner.
   *
   * @example Position in the bottom-left corner
   * ```ts
   * { bottom: 8, left: 8 }
   * ```
   */
  scaleBarPosition?: OrnamentViewPosition;

  /**
   * Android only: Switch between TextureView (default) and GLSurfaceView for
   * rendering the map
   *
   * @defaultValue "surface"
   */
  androidView?: "surface" | "texture";

  /**
   * Called when a user presses the map
   *
   * If the event bubbles up from a child `Source` with an `onPress` handler the
   * `features` will be included. The event will emit on `Map` and `Source` . To
   * prevent this use `event.stopPropagation()` in the `Source` handler.
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

  /**
   * Ref to access Map methods.
   */
  ref?: Ref<MapRef>;
}

/**
 * A view of a MapLibre Native Map.
 *
 * @example Rendering a basic Map
 * ```tsx
 * <Map mapStyle="https://demotiles.maplibre.org/style.json" />;
 * ```
 */
export const Map = memo(
  ({ androidView = "surface", style, ref, ...props }: MapProps) => {
    const [isReady, setIsReady] = useState(false);

    const nativeRef = useRef<
      Component<ComponentProps<typeof MapViewNativeComponent>> &
        ReactNativeElement
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
        NativeMapViewModule.project(findNodeHandle(nativeRef.current), lngLat),

      unproject: (point) =>
        NativeMapViewModule.unproject(findNodeHandle(nativeRef.current), point),

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
            getNativeFilter(options?.filter) as string[],
          );
        } else if (
          pixelPointOrPixelPointBoundsOrOptions &&
          Array.isArray(pixelPointOrPixelPointBoundsOrOptions) &&
          ((value: PixelPoint | PixelPointBounds): value is PixelPointBounds =>
            Array.isArray(value[0]) && Array.isArray(value[1]))(
            pixelPointOrPixelPointBoundsOrOptions,
          )
        ) {
          return await NativeMapViewModule.queryRenderedFeaturesWithBounds(
            findNodeHandle(nativeRef.current),
            pixelPointOrPixelPointBoundsOrOptions,
            options?.layers ?? [],
            getNativeFilter(options?.filter) as string[],
          );
        } else {
          return await NativeMapViewModule.queryRenderedFeaturesWithBounds(
            findNodeHandle(nativeRef.current),
            null,
            pixelPointOrPixelPointBoundsOrOptions?.layers ?? [],
            getNativeFilter(
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
        NativeMapViewModule.showAttribution(findNodeHandle(nativeRef.current)),
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
        light: props.light
          ? transformStyle(convertToInternalStyle(props.light))
          : undefined,
      };
    }, [props]);

    let map: ReactElement | null = null;
    if (isReady) {
      const NativeMapView =
        Platform.OS === "android" && androidView === "texture"
          ? AndroidTextureMapViewNativeComponent
          : MapViewNativeComponent;

      map = <NativeMapView {...nativeProps} />;
    }

    return (
      <View
        onLayout={() => setIsReady(true)}
        style={style ?? styles.flex1}
        testID={nativeProps.testID ? `${nativeProps.testID}-view` : undefined}
      >
        {map}
      </View>
    );
  },
);
