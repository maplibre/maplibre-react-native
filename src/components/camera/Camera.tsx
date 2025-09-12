import {
  type Component,
  type ComponentProps,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from "react";
import { findNodeHandle, type NativeMethods } from "react-native";
import type { DirectEventHandler } from "react-native/Libraries/Types/CodegenTypes";

import type { TrackUserLocationChangeEvent } from "./NativeCameraComponent";
import NativeCameraComponent from "./NativeCameraComponent";
import NativeCameraModule from "./NativeCameraModule";
import { type BaseProps } from "../../types/BaseProps";
import type { Bounds } from "../../types/Bounds";
import type { ViewPadding } from "../../types/ViewPadding";

interface CameraOptions {
  /**
   * The zoom level of the map.
   */
  zoom?: number;

  /**
   *  The bearing (rotation) of the map.
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

interface CameraAnimationOptions {
  /**
   * The duration the map takes to animate to a new configuration.
   */
  duration?: number;

  /**
   *  The easing or path the camera uses to animate to a new configuration.
   */
  easing?: "linear" | "ease" | "fly";
}

export interface CameraCenterOptions {
  longitude: number;
  latitude: number;
}

export interface CameraBoundsOptions {
  /**
   * The corners of a box around which the map should bound.
   */
  bounds: Bounds;
}

type CameraCenterStop = CameraOptions &
  CameraAnimationOptions &
  CameraCenterOptions;

type CameraBoundsStop = CameraOptions &
  CameraAnimationOptions &
  CameraBoundsOptions;

export type CameraStop =
  | (CameraOptions &
      CameraAnimationOptions & {
        longitude?: never;
        latitude?: never;
        bounds?: never;
      })
  | CameraCenterStop
  | CameraBoundsStop;

export type InitialViewState =
  | (CameraOptions & {
      longitude?: never;
      latitude?: never;
      bounds?: never;
    })
  | (CameraOptions & CameraCenterOptions)
  | (CameraOptions & CameraBoundsOptions);

export interface CameraRef {
  /**
   * Map camera will perform updates based on provided config. Advanced use only!
   *
   * @example
   * cameraRef.current?.setCamera({
   *   centerCoordinate: [lng, lat],
   *   zoomLevel: 16,
   *   duration: 2000,
   * })
   *
   * cameraRef.current?.setCamera({
   *   stops: [
   *     { pitch: 45, duration: 200 },
   *     { heading: 180, duration: 300 },
   *   ]
   * })
   *
   *  @param stop Array of Camera stops
   */
  setStop(stop: CameraStop): Promise<void>;

  /**
   * Map camera will move to new coordinate at the same zoom level
   *
   * @example
   * cameraRef.current?.easeTo([lng, lat], 200) // eases camera to new location based on duration
   * cameraRef.current?.easeTo([lng, lat]) // snaps camera to new location without any easing
   *
   *  @param options.center Coordinates that map camera will move too
   *  @param options.duration Duration of camera animation
   */
  jumpTo(options: { center: CameraCenterOptions } & CameraOptions): void;

  /**
   * Map camera will move to new coordinate at the same zoom level
   *
   * @example
   * cameraRef.current?.easeTo([lng, lat], 200) // eases camera to new location based on duration
   * cameraRef.current?.easeTo([lng, lat]) // snaps camera to new location without any easing
   *
   *  @param options.center Coordinates that map camera will move too
   *  @param options.duration Duration of camera animation
   */
  easeTo(
    options: { center: CameraCenterOptions } & Pick<
      CameraAnimationOptions,
      "duration"
    >,
  ): void;

  /**
   * Map camera will fly to new coordinate
   *
   * @example
   * cameraRef.current?.flyTo([lng, lat])
   * cameraRef.current?.flyTo([lng, lat], 12000)
   *
   *  @param options.center Coordinates that map camera will jump to
   *  @param options.duration Duration of camera animation
   */
  flyTo(
    options: {
      center: CameraCenterOptions;
    } & Pick<CameraAnimationOptions, "duration">,
  ): void;

  /**
   * Map camera transitions to fit provided bounds
   *
   * @example
   * cameraRef.current?.fitBounds([west, south, east, north])
   * cameraRef.current?.fitBounds([west, south, east, north], { top: 20, right: 20, bottom: 20, left: 20 }, 1000)
   *
   * @param bounds
   * @param options
   * @param options.padding Padding for the bounds
   * @param options.duration Duration of camera animation
   */
  fitBounds(
    bounds: Bounds,
    options?: Pick<CameraOptions, "padding"> &
      Pick<CameraAnimationOptions, "duration">,
  ): void;

  /**
   * Map camera will zoom to specified level
   *
   * @example
   * cameraRef.current?.zoomTo(16)
   * cameraRef.current?.zoomTo(16, 100)
   *
   * @param zoom Zoom level that the map camera will animate too
   * @param options Options
   * @param options.duration Duration of camera movement
   */
  zoomTo(
    zoom: number,
    options?: Pick<CameraAnimationOptions, "duration">,
  ): void;
}

export type UserTrackingModeChangeCallback =
  DirectEventHandler<TrackUserLocationChangeEvent>;

export type CameraProps = BaseProps &
  CameraStop & {
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
    maxBounds?: Bounds;

    /**
     * The mode used to track the user location on the map:
     *
     * - undefined: The user's location is not tracked
     * - "default": Centers the user's location
     * - "heading": Centers the user's location and uses the compass for bearing
     * - "course": Centers the user's location and uses the direction of travel for bearing
     *
     * @default undefined
     */
    trackUserLocation?: "default" | "heading" | "course";

    /**
     * Triggered when `trackUserLocation` changes
     */
    onTrackUserLocationChange?: UserTrackingModeChangeCallback;
  };

export const Camera = memo(
  forwardRef<CameraRef, CameraProps>(
    (
      {
        initialViewState,
        minZoom,
        maxZoom,
        maxBounds,
        trackUserLocation,
        onTrackUserLocationChange,
        ...stop
      },
      ref,
    ) => {
      const nativeRef = useRef<
        Component<ComponentProps<typeof NativeCameraComponent>> &
          Readonly<NativeMethods>
      >(null);

      const setStop: CameraRef["setStop"] = (stop) =>
        NativeCameraModule.setStop(findNodeHandle(nativeRef.current), stop);

      useImperativeHandle(ref, () => ({
        setStop,

        jumpTo: ({ center, ...options }) =>
          setStop({ ...center, ...options, duration: 0, easing: undefined }),

        easeTo: ({ center, duration = 2000 }) =>
          setStop({ ...center, duration, easing: "ease" }),

        flyTo: ({ center, duration = 2000 }) =>
          setStop({ ...center, duration, easing: "fly" }),

        fitBounds: (bounds, { padding, duration = 2000 } = {}) =>
          setStop({ bounds, padding, duration, easing: "ease" }),

        zoomTo: (zoom, { duration = 2000 } = {}) =>
          setStop({ zoom, duration, easing: "fly" }),
      }));

      return (
        <NativeCameraComponent
          ref={nativeRef}
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
  ),
);
