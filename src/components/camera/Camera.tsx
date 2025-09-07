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

import type {
  TrackUserLocationMode,
  TrackUserLocationChangeEvent,
} from "./NativeCameraComponent";
import NativeCameraComponent from "./NativeCameraComponent";
import NativeCameraModule from "./NativeCameraModule";
import { type BaseProps } from "../../types/BaseProps";
import type { Bounds } from "../../types/Bounds";
import { CameraMode } from "../../types/CameraMode";
import type { ViewPadding } from "../../types/ViewPadding";

export type UserTrackingModeChangeCallback =
  DirectEventHandler<TrackUserLocationChangeEvent>;

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
   *  @param stops Array of Camera stops
   */
  setCamera(stops: CameraStop[]): Promise<void>;

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
  easeTo(options: {
    center: { longitude: number; latitude: number };
    duration?: number;
  }): void;

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
  flyTo(options: {
    center: { longitude: number; latitude: number };
    duration?: number;
  }): void;

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
    options: {
      padding?: ViewPadding;
      duration?: number;
    },
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
  zoomTo(zoom: number, options: { duration?: number }): void;
}

interface BaseCameraStop {
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

  /**
   * The duration the map takes to animate to a new configuration.
   */
  duration?: number;

  /**
   *  The easing or path the camera uses to animate to a new configuration.
   */
  mode?: CameraMode;
}

export interface CameraCenterStop extends BaseCameraStop {
  center?: {
    longitude: number;
    latitude: number;
  };
}

export interface CameraBoundsStop extends BaseCameraStop {
  /**
   * The corners of a box around which the map should bound.
   */
  bounds?: Bounds;
}

export type CameraStop = CameraCenterStop | CameraBoundsStop;

export type CameraStops = {
  stops: CameraStop[];
};

export interface CameraProps
  extends BaseProps,
    CameraCenterStop,
    CameraBoundsStop {
  /**
   * Default view settings applied on camera
   */
  initialViewState?: CameraStop;

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
   * Should the map orientation follow the user's location.
   */
  followUserLocation?: boolean;

  /**
   * The mode used to track the user location on the map. One of; "normal", "compass", "course". Each mode string is also available as a member on the `UserTrackingMode` object. `Follow` (normal), `FollowWithHeading` (compass), `FollowWithCourse` (course). NOTE: `followUserLocation` must be set to `true` for any of the modes to take effect.
   */
  followUserMode?: TrackUserLocationMode;

  /**
   * The zoomLevel on map while followUserLocation is set to `true`
   */
  followZoom?: number;

  /**
   * The bearing on map while followUserLocation is set to `true`
   */
  followBearing?: number;

  /**
   * The pitch on map while followUserLocation is set to `true`
   */
  followPitch?: number;

  /**
   * Triggered when `followUserLocation` or `followUserMode` changes
   */
  onUserTrackingModeChange?: UserTrackingModeChangeCallback;
}

export const Camera = memo(
  forwardRef<CameraRef, CameraProps>((props, ref) => {
    const nativeRef = useRef<
      Component<ComponentProps<typeof NativeCameraComponent>> &
        Readonly<NativeMethods>
    >(null);

    const setCamera: CameraRef["setCamera"] = (stops) =>
      NativeCameraModule.setCamera(findNodeHandle(nativeRef.current), stops);

    useImperativeHandle(ref, () => ({
      setCamera,

      easeTo: ({ center, duration = 0 }) =>
        setCamera([{ center, duration, mode: CameraMode.Ease }]),

      flyTo: ({ center, duration = 2000 }) =>
        setCamera([{ center, duration, mode: CameraMode.Flight }]),

      fitBounds: async (bounds, options) => {
        await setCamera([{ bounds, ...options, mode: CameraMode.Ease }]);
      },

      zoomTo: (zoom, { duration = 2000 }) =>
        setCamera([{ zoom, duration, mode: CameraMode.Flight }]),
    }));

    return <NativeCameraComponent ref={nativeRef} {...props} />;
  }),
);
