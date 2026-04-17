import {
  type Component,
  type ComponentProps,
  memo,
  type Ref,
  useImperativeHandle,
  useRef,
} from "react";
import {
  findNodeHandle,
  type NativeSyntheticEvent,
  type ReactNativeElement,
} from "react-native";

import NativeCameraComponent from "./CameraNativeComponent";
import NativeCameraModule from "./NativeCameraModule";
import { type BaseProps } from "../../types/BaseProps";
import type { LngLat } from "../../types/LngLat";
import type { LngLatBounds } from "../../types/LngLatBounds";
import type { ViewPadding } from "../../types/ViewPadding";

/**
 * Camera viewport configuration: zoom, bearing, pitch, and padding.
 */
export interface CameraOptions {
  /**
   * The zoom level of the map.
   */
  zoom?: number;

  /**
   * The bearing (rotation) of the map.
   */
  bearing?: number;

  /**
   * The pitch of the map.
   */
  pitch?: number;

  /**
   * The viewport padding in points.
   */
  padding?: ViewPadding;
}

/**
 * Easing function used for camera animations.
 */
export type CameraEasing = undefined | "linear" | "ease" | "fly";

/**
 * Animation timing options for camera transitions.
 */
export interface CameraAnimationOptions {
  /**
   * The duration the map takes to animate to a new configuration.
   */
  duration?: number;

  /**
   * The easing or path the camera uses to animate to a new configuration.
   */
  easing?: CameraEasing;
}

/**
 * Camera center coordinate options.
 */
export interface CameraCenterOptions {
  /**
   * Geographic center coordinates of the map
   */
  center: LngLat;
}

/**
 * Camera bounds options.
 */
export interface CameraBoundsOptions {
  /**
   * The corners of a box around which the map should bound.
   */
  bounds: LngLatBounds;
}

/**
 * Camera animation stop positioned by a center coordinate.
 */
export type CameraCenterStop = CameraOptions &
  CameraAnimationOptions &
  CameraCenterOptions;

/**
 * Camera animation stop positioned by geographic bounds.
 */
export type CameraBoundsStop = CameraOptions &
  CameraAnimationOptions &
  CameraBoundsOptions;

/**
 * A single camera animation stop — optionally positioned by center, bounds, or
 * neither.
 */
export type CameraStop =
  | (CameraOptions &
      CameraAnimationOptions & {
        center?: never;
        bounds?: never;
      })
  | CameraCenterStop
  | CameraBoundsStop;

/**
 * Initial camera state when the map first loads.
 */
export type InitialViewState =
  | (CameraOptions & {
      center?: never;
      bounds?: never;
    })
  | (CameraOptions & CameraCenterOptions)
  | (CameraOptions & CameraBoundsOptions);

/**
 * User location tracking mode.
 */
export type TrackUserLocation = "default" | "heading" | "course";

/**
 * Event emitted when the user location tracking mode changes.
 */
export type TrackUserLocationChangeEvent = {
  trackUserLocation: TrackUserLocation | null;
};

export interface CameraRef {
  /**
   * Map camera will move to new coordinates at the same zoom level
   *
   * @example Jump to a position
   * ```ts
   * cameraRef.current?.jumpTo({ center: [lng, lat] });
   * ```
   */
  jumpTo(options: CameraCenterOptions & CameraOptions): void;

  /**
   * Map camera will move to new coordinates at the same zoom level
   *
   * @example Eases camera to new location based on duration
   * ```ts
   * cameraRef.current?.easeTo({ center: [lng, lat], duration: 200 });
   * ```
   */
  easeTo(
    options: CameraCenterOptions & CameraOptions & CameraAnimationOptions,
  ): void;

  /**
   * Map camera will fly to new coordinate
   *
   * @example
   * ```ts
   * cameraRef.current?.flyTo({ center: [lng, lat], duration: 12000 });
   * ```
   */
  flyTo(
    options: CameraCenterOptions & CameraOptions & CameraAnimationOptions,
  ): void;

  /**
   * Map camera transitions to fit provided bounds
   *
   * @example
   * ```ts
   * cameraRef.current?.fitBounds(
   *   [west, south, east, north],
   *   { top: 20, right: 20, bottom: 20, left: 20 },
   *   1000,
   * );
   * ```
   */
  fitBounds(
    bounds: LngLatBounds,
    options?: CameraOptions & CameraAnimationOptions,
  ): void;

  /**
   * Map camera will zoom to specified level
   *
   * @param zoom - Zoom level that the map camera will animate too
   * @param options - Options
   *
   * @example
   * ```ts
   * cameraRef.current?.zoomTo(16, { duration: 100 });
   * ```
   */
  zoomTo(zoom: number, options?: CameraOptions & CameraAnimationOptions): void;

  /**
   * Map camera will perform updates based on provided config. Advanced use only!
   *
   * @param stop - Array of Camera stops
   *
   * @example
   * ```ts
   * cameraRef.current?.setStop({
   *   centerCoordinate: [lng, lat],
   *   zoomLevel: 16,
   *   duration: 2000,
   * });
   * ```
   *
   * @example
   * ```ts
   * cameraRef.current?.setStop({
   *   stops: [
   *     { pitch: 45, duration: 200 },
   *     { heading: 180, duration: 300 },
   *   ],
   * });
   * ```
   */
  setStop(stop: CameraStop): Promise<void>;
}

export type CameraProps = BaseProps &
  Partial<CameraStop> & {
    /**
     * Default view settings applied on camera
     */
    initialViewState?: InitialViewState;

    /**
     * Minimum zoom level of the map
     */
    minZoom?: number;

    /**
     * Maximum zoom level of the map
     */
    maxZoom?: number;

    /**
     * Restrict map panning so that the center is within these bounds
     */
    maxBounds?: LngLatBounds;

    /**
     * The mode used to track the user location on the map:
     *
     * - `undefined`: The user's location is not tracked
     * - `"default"`: Centers the user's location
     * - `"heading"`: Centers the user's location and uses the compass for bearing
     * - `"course"`: Centers the user's location and uses the direction of travel for
     *   bearing
     *
     * @defaultValue undefined
     */
    trackUserLocation?: TrackUserLocation;

    /**
     * Triggered when `trackUserLocation` changes
     */
    onTrackUserLocationChange?: (
      event: NativeSyntheticEvent<TrackUserLocationChangeEvent>,
    ) => void;

    /**
     * Ref to access Camera methods.
     */
    ref?: Ref<CameraRef>;
  };

/**
 * Controls the viewport of the Map.
 */
export const Camera = memo(
  ({
    testID,
    initialViewState,
    minZoom,
    maxZoom,
    maxBounds,
    trackUserLocation,
    onTrackUserLocationChange,
    ref,
    ...stop
  }: CameraProps) => {
    const nativeRef = useRef<
      Component<ComponentProps<typeof NativeCameraComponent>> &
        ReactNativeElement
    >(null);

    const setStop: CameraRef["setStop"] = (stop) => {
      const nodeHandle = findNodeHandle(nativeRef.current);

      if (!nodeHandle) {
        throw new Error(
          "NativeCameraComponent ref is null, wait for the map being initialized",
        );
      }

      return NativeCameraModule.setStop(nodeHandle, stop);
    };

    useImperativeHandle(ref, () => ({
      setStop,

      jumpTo: ({ center, ...options }) =>
        setStop({ ...options, center, duration: 0, easing: undefined }),

      easeTo: ({ center, duration = 500, easing = "ease", ...options }) =>
        setStop({ ...options, center, duration, easing }),

      flyTo: ({ center, duration = 2000, easing = "fly", ...options }) =>
        setStop({ ...options, center, duration, easing }),

      fitBounds: (
        bounds,
        { duration = 2000, easing = "fly", ...options } = {},
      ) => setStop({ ...options, bounds, duration, easing }),

      zoomTo: (zoom, { duration = 500, easing = "ease", ...options } = {}) =>
        setStop({ ...options, zoom, duration, easing }),
    }));

    return (
      <NativeCameraComponent
        ref={nativeRef}
        testID={testID}
        stop={stop}
        initialViewState={initialViewState}
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBounds={maxBounds}
        trackUserLocation={trackUserLocation}
        onTrackUserLocationChange={onTrackUserLocationChange}
      />
    );
  },
);
