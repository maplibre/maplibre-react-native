import React, { memo, useCallback, useImperativeHandle, useMemo } from "react";
import { requireNativeComponent, ViewProps } from "react-native";

import { CameraModes } from "../MLNModule";
import { useNativeRef } from "../hooks/useNativeRef";
import { MaplibreGLEvent } from "../types";
import BaseProps from "../types/BaseProps";
import { CameraMode } from "../types/CameraMode";
import { makeNativeBounds } from "../utils/makeNativeBounds";
import { makeNativeStop } from "../utils/makeNativeStop";

export const NATIVE_MODULE_NAME = "RCTMLNCamera";

export enum UserTrackingMode {
  Follow = "normal",
  FollowWithHeading = "compass",
  FollowWithCourse = "course",
}

export type UserTrackingModeChangeCallback = (
  event: MaplibreGLEvent<
    "usertrackingmodechange",
    {
      followUserLocation: boolean;
      followUserMode: UserTrackingMode | null;
    }
  >,
) => void;

export function nativeAnimationMode(mode?: CameraAnimationMode): CameraMode {
  switch (mode) {
    case "flyTo":
      return CameraModes.Flight;
    case "moveTo":
      return CameraModes.None;
    case "linearTo":
      return CameraModes.Linear;
    case "easeTo":
      return CameraModes.Ease;
    default:
      return CameraModes.None;
  }
}

export interface CameraRef {
  setCamera: (config: CameraStop | CameraStops) => void;

  fitBounds: (
    ne: GeoJSON.Position,
    sw: GeoJSON.Position,
    paddingConfig?: number | number[],
    animationDuration?: number,
  ) => void;

  flyTo: (
    centerCoordinate: GeoJSON.Position,
    animationDuration?: number,
  ) => void;

  moveTo: (
    centerCoordinate: GeoJSON.Position,
    animationDuration?: number,
  ) => void;

  zoomTo: (zoomLevel: number, animationDuration?: number) => void;
}

export interface CameraPadding {
  /**
   * Left padding in points
   */
  paddingLeft?: number;
  /**
   * Right padding in points
   */
  paddingRight?: number;
  /**
   * Top padding in points
   */
  paddingTop?: number;
  /**
   * Bottom padding in points
   */
  paddingBottom?: number;
}

export interface CameraBounds {
  /**
   * North east coordinate of bound
   */
  ne: number[];
  /**
   * South west coordinate of bound
   */
  sw: number[];
}

interface CameraBoundsWithPadding
  extends CameraBounds,
    Partial<CameraPadding> {}

export type CameraAnimationMode = "flyTo" | "easeTo" | "linearTo" | "moveTo";

export interface NativeCameraStop extends CameraPadding {
  duration?: number;
  mode?: CameraMode;
  pitch?: number;
  heading?: number;
  zoom?: number;
  centerCoordinate?: string;
  bounds?: string;
}

export interface CameraStop {
  /** The location on which the map should center. */
  centerCoordinate?: GeoJSON.Position;
  /** The corners of a box around which the map should bound. Contains padding props for backwards
   * compatibility; the root `padding` prop should be used instead. */
  bounds?: CameraBoundsWithPadding;
  /** The heading (orientation) of the map. */
  heading?: number;
  /** The pitch of the map. */
  pitch?: number;
  /** The zoom level of the map. */
  zoomLevel?: number;
  /** The viewport padding in points. */
  padding?: CameraPadding;
  /** The duration the map takes to animate to a new configuration. */
  animationDuration?: number;
  /** The easing or path the camera uses to animate to a new configuration. */
  animationMode?: CameraAnimationMode;
}

export type CameraStops = {
  stops: CameraStop[];
};

export interface CameraProps extends BaseProps, CameraStop {
  /**
   * Default view settings applied on camera
   */
  defaultSettings?: CameraStop;

  /**
   * Minimum zoom level of the map
   */
  minZoomLevel?: number;

  /**
   * Maximum zoom level of the map
   */
  maxZoomLevel?: number;

  /**
   * Restrict map panning so that the center is within these bounds
   */
  maxBounds?: CameraBounds;

  /**
   * Should the map orientation follow the user's.
   */
  followUserLocation?: boolean;

  /**
   * The mode used to track the user location on the map. One of; "normal", "compass", "course". Each mode string is also available as a member on the `MapLibreGL.UserTrackingModes` object. `Follow` (normal), `FollowWithHeading` (compass), `FollowWithCourse` (course). NOTE: `followUserLocation` must be set to `true` for any of the modes to take effect. [Example](/packages/examples/src/examples/Camera/SetUserTrackingModes.js)
   */
  followUserMode?: UserTrackingMode;

  /**
   * The zoomLevel on map while followUserLocation is set to `true`
   */
  followZoomLevel?: number;

  /**
   * The pitch on map while followUserLocation is set to `true`
   */
  followPitch?: number;

  /**
   * The heading on map while followUserLocation is set to `true`
   */
  followHeading?: number;

  /**
   * Triggered when `followUserLocation` or `followUserMode` changes
   */
  onUserTrackingModeChange?: UserTrackingModeChangeCallback;
}

export interface NativeCameraProps
  extends Omit<CameraProps, "maxBounds">,
    ViewProps {
  maxBounds?: string;
  stop?: NativeCameraStop;
  defaultStop?: NativeCameraStop;
}

const Camera = memo(
  React.forwardRef<CameraRef, CameraProps>(
    (
      {
        animationMode,
        animationDuration,
        bounds,
        centerCoordinate,
        defaultSettings,
        followUserLocation,
        followHeading,
        followPitch,
        followUserMode,
        followZoomLevel,
        heading,
        maxBounds,
        maxZoomLevel,
        minZoomLevel,
        onUserTrackingModeChange,
        padding,
        pitch,
        zoomLevel,
      }: CameraProps,
      ref,
    ) => {
      const nativeCamera = useNativeRef<NativeCameraProps>();

      const nativeStop = useMemo(() => {
        return makeNativeStop({
          animationDuration,
          animationMode,
          bounds,
          centerCoordinate,
          heading,
          padding,
          pitch,
          zoomLevel,
        });
      }, [
        animationDuration,
        animationMode,
        bounds,
        centerCoordinate,
        heading,
        padding,
        pitch,
        zoomLevel,
      ]);

      const nativeDefaultStop = useMemo(() => {
        return makeNativeStop(defaultSettings);
      }, [defaultSettings]);

      const nativeMaxBounds = useMemo(() => {
        if (!maxBounds?.ne || !maxBounds?.sw) {
          return undefined;
        }
        return makeNativeBounds(maxBounds.ne, maxBounds.sw);
      }, [maxBounds]);

      const setCamera = useCallback(
        (config: CameraStop | CameraStops = {}): void => {
          if ("stops" in config) {
            nativeCamera.current?.setNativeProps({
              stop: {
                stops: config.stops
                  .map((stopItem) => makeNativeStop(stopItem))
                  .filter((stopItem) => !!stopItem),
              },
            });
          } else {
            const nativeStop = makeNativeStop(config);

            if (nativeStop) {
              nativeCamera.current?.setNativeProps({ stop: nativeStop });
            }
          }
        },
        [nativeCamera],
      );

      const fitBounds = useCallback(
        (
          ne: GeoJSON.Position,
          sw: GeoJSON.Position,
          paddingConfig?: number | number[],
          animationDuration?: number,
        ): void => {
          const _padding: CameraPadding = {};

          if (Array.isArray(paddingConfig)) {
            if (paddingConfig.length === 2) {
              _padding.paddingTop = paddingConfig[0];
              _padding.paddingBottom = paddingConfig[0];
              _padding.paddingLeft = paddingConfig[1];
              _padding.paddingRight = paddingConfig[1];
            } else if (paddingConfig.length === 4) {
              _padding.paddingTop = paddingConfig[0];
              _padding.paddingRight = paddingConfig[1];
              _padding.paddingBottom = paddingConfig[2];
              _padding.paddingLeft = paddingConfig[3];
            }
          } else if (typeof paddingConfig === "number") {
            _padding.paddingLeft = paddingConfig;
            _padding.paddingRight = paddingConfig;
            _padding.paddingTop = paddingConfig;
            _padding.paddingBottom = paddingConfig;
          }

          setCamera({
            bounds: { ne, sw },
            padding: _padding,
            animationDuration,
            animationMode: "easeTo",
          });
        },
        [setCamera],
      );

      const flyTo = useCallback(
        (coordinates: GeoJSON.Position, animationDuration = 2000): void => {
          setCamera({
            centerCoordinate: coordinates,
            animationDuration,
            animationMode: "flyTo",
          });
        },
        [setCamera],
      );

      const moveTo = useCallback(
        (centerCoordinate: GeoJSON.Position, animationDuration = 0): void => {
          setCamera({
            centerCoordinate,
            animationDuration,
            animationMode: "easeTo",
          });
        },
        [setCamera],
      );

      const zoomTo = useCallback(
        (zoomLevel: number, animationDuration = 2000): void => {
          setCamera({
            zoomLevel,
            animationDuration,
            animationMode: "flyTo",
          });
        },
        [setCamera],
      );

      useImperativeHandle(
        ref,
        (): CameraRef => ({
          /**
           * Map camera transitions to fit provided bounds
           *
           * @example
           * cameraRef.current?.fitBounds([lng, lat], [lng, lat])
           * cameraRef.current?.fitBounds([lng, lat], [lng, lat], 20, 1000) // padding for all sides
           * cameraRef.current?.fitBounds([lng, lat], [lng, lat], [verticalPadding, horizontalPadding], 1000)
           * cameraRef.current?.fitBounds([lng, lat], [lng, lat], [top, right, bottom, left], 1000)
           *
           * @param {Array<Number>} northEastCoordinates - North east coordinate of bound
           * @param {Array<Number>} southWestCoordinates - South west coordinate of bound
           * @param {Number|Array<Number>|undefined} padding - Padding for the bounds
           * @param {Number=} animationDuration - Duration of camera animation
           * @return {void}
           */
          fitBounds,
          /**
           * Map camera will fly to new coordinate
           *
           * @example
           * cameraRef.current?.flyTo([lng, lat])
           * cameraRef.current?.flyTo([lng, lat], 12000)
           *
           *  @param {Array<Number>} coordinates - Coordinates that map camera will jump too
           *  @param {Number=} animationDuration - Duration of camera animation
           *  @return {void}
           */
          flyTo,
          /**
           * Map camera will move to new coordinate at the same zoom level
           *
           * @example
           * cameraRef.current?.moveTo([lng, lat], 200) // eases camera to new location based on duration
           * cameraRef.current?.moveTo([lng, lat]) // snaps camera to new location without any easing
           *
           *  @param {Array<Number>} coordinates - Coordinates that map camera will move too
           *  @param {Number=} animationDuration - Duration of camera animation
           *  @return {void}
           */
          moveTo,
          /**
           * Map camera will zoom to specified level
           *
           * @example
           * cameraRef.current?.zoomTo(16)
           * cameraRef.current?.zoomTo(16, 100)
           *
           * @param {Number} zoomLevel - Zoom level that the map camera will animate too
           * @param {Number=} animationDuration - Duration of camera animation
           * @return {void}
           */
          zoomTo,
          /**
           * Map camera will perform updates based on provided config. Advanced use only!
           *
           * @example
           * cameraRef.current?.setCamera({
           *   centerCoordinate: [lng, lat],
           *   zoomLevel: 16,
           *   animationDuration: 2000,
           * })
           *
           * cameraRef.current?.setCamera({
           *   stops: [
           *     { pitch: 45, animationDuration: 200 },
           *     { heading: 180, animationDuration: 300 },
           *   ]
           * })
           *
           *  @param {Object} config - Camera configuration
           */
          setCamera,
        }),
      );

      return (
        <RCTMLNCamera
          testID="Camera"
          ref={nativeCamera}
          stop={nativeStop}
          defaultStop={nativeDefaultStop}
          maxBounds={nativeMaxBounds}
          followUserLocation={followUserLocation}
          followHeading={followHeading}
          followPitch={followPitch}
          followUserMode={followUserMode}
          followZoomLevel={followZoomLevel}
          maxZoomLevel={maxZoomLevel}
          minZoomLevel={minZoomLevel}
          onUserTrackingModeChange={onUserTrackingModeChange}
        />
      );
    },
  ),
);

const RCTMLNCamera =
  requireNativeComponent<NativeCameraProps>(NATIVE_MODULE_NAME);

export default Camera;
