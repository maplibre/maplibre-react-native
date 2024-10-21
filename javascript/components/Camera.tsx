import { point } from "@turf/helpers";
import React, { memo, useCallback, useImperativeHandle, useMemo } from "react";
import { NativeModules, requireNativeComponent, ViewProps } from "react-native";

import { useNativeRef } from "../hooks/useNativeRef";
import { MaplibreGLEvent } from "../types";
import BaseProps from "../types/BaseProps";
import { makeLatLngBounds } from "../utils/geoUtils";

const MapLibreGL = NativeModules.MLNModule;

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

export function nativeAnimationMode(
  mode?: CameraAnimationMode,
): NativeAnimationMode {
  switch (mode) {
    case "flyTo":
      return MapLibreGL.CameraModes.Flight;
    case "moveTo":
      return MapLibreGL.CameraModes.None;
    case "linearTo":
      return MapLibreGL.CameraModes.Linear;
    default:
      return MapLibreGL.CameraModes.Ease;
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

type NativeAnimationMode = "flight" | "ease" | "linear" | "none" | "move";
export type CameraAnimationMode = "flyTo" | "easeTo" | "linearTo" | "moveTo";

export interface NativeCameraStop extends CameraPadding {
  duration?: number;
  mode?: NativeAnimationMode;
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
   * If false, the camera will not send any props to the native module. Intended to be used to prevent unnecessary tile fetching and improve performance when the map is not visible. Defaults to true.
   */
  allowUpdates?: boolean;

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
   * The mode used to track the user location on the map. One of; "normal", "compass", "course". Each mode string is also available as a member on the `MapLibreGL.UserTrackingModes` object. `Follow` (normal), `FollowWithHeading` (compass), `FollowWithCourse` (course). NOTE: `followUserLocation` must be set to `true` for any of the modes to take effect. [Example](../example/src/examples/Camera/SetUserTrackingModes.js)
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
        allowUpdates = true,
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

      const buildNativeStop = useCallback(
        (
          stop: CameraStop,
          ignoreFollowUserLocation = false,
        ): NativeCameraStop | undefined => {
          if (followUserLocation && !ignoreFollowUserLocation) {
            return undefined;
          }

          const _nativeStop: NativeCameraStop = {};

          if (stop.animationDuration !== undefined) {
            _nativeStop.duration = stop.animationDuration;
          }
          if (stop.animationMode !== undefined) {
            _nativeStop.mode = nativeAnimationMode(stop.animationMode);
          }
          if (stop.centerCoordinate) {
            _nativeStop.centerCoordinate = JSON.stringify(
              point(stop.centerCoordinate),
            );
          }
          if (stop.heading !== undefined) {
            _nativeStop.heading = stop.heading;
          }
          if (stop.pitch !== undefined) {
            _nativeStop.pitch = stop.pitch;
          }
          if (stop.zoomLevel !== undefined) {
            _nativeStop.zoom = stop.zoomLevel;
          }

          if (stop.bounds && stop.bounds.ne && stop.bounds.sw) {
            const { ne, sw } = stop.bounds;
            _nativeStop.bounds = JSON.stringify(makeLatLngBounds(ne, sw));
          }

          const paddingTop =
            stop.padding?.paddingTop ?? stop.bounds?.paddingTop;
          if (paddingTop !== undefined) {
            _nativeStop.paddingTop = paddingTop;
          }

          const paddingRight =
            stop.padding?.paddingRight ?? stop.bounds?.paddingRight;
          if (paddingRight !== undefined) {
            _nativeStop.paddingRight = paddingRight;
          }

          const paddingBottom =
            stop.padding?.paddingBottom ?? stop.bounds?.paddingBottom;
          if (paddingBottom !== undefined) {
            _nativeStop.paddingBottom = paddingBottom;
          }

          const paddingLeft =
            stop.padding?.paddingLeft ?? stop.bounds?.paddingLeft;
          if (paddingLeft !== undefined) {
            _nativeStop.paddingLeft = paddingLeft;
          }

          return _nativeStop;
        },
        [followUserLocation],
      );

      const nativeStop = useMemo(() => {
        return buildNativeStop({
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
        buildNativeStop,
        animationDuration,
        animationMode,
        bounds,
        centerCoordinate,
        heading,
        padding,
        pitch,
        zoomLevel,
      ]);

      const nativeDefaultStop = useMemo((): NativeCameraStop | undefined => {
        if (!defaultSettings) {
          return undefined;
        }

        return buildNativeStop(defaultSettings, true);
      }, [buildNativeStop, defaultSettings]);

      const nativeMaxBounds = useMemo(() => {
        if (!maxBounds?.ne || !maxBounds?.sw) {
          return undefined;
        }
        return JSON.stringify(makeLatLngBounds(maxBounds.ne, maxBounds.sw));
      }, [maxBounds]);

      const setCamera = useCallback(
        (config: CameraStop | CameraStops = {}): void => {
          if (!allowUpdates) {
            return;
          }

          if ("stops" in config) {
            nativeCamera.current?.setNativeProps({
              stop: {
                stops: config.stops
                  .map((stopItem) => buildNativeStop(stopItem))
                  .filter((stopItem) => !!stopItem),
              },
            });
          } else {
            const nativeStop = buildNativeStop(config);

            if (nativeStop) {
              nativeCamera.current?.setNativeProps({ stop: nativeStop });
            }
          }
        },
        [allowUpdates, buildNativeStop, nativeCamera],
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
           * this.camera.fitBounds([lng, lat], [lng, lat])
           * this.camera.fitBounds([lng, lat], [lng, lat], 20, 1000) // padding for all sides
           * this.camera.fitBounds([lng, lat], [lng, lat], [verticalPadding, horizontalPadding], 1000)
           * this.camera.fitBounds([lng, lat], [lng, lat], [top, right, bottom, left], 1000)
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
           * this.camera.flyTo([lng, lat])
           * this.camera.flyTo([lng, lat], 12000)
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
           * this.camera.moveTo([lng, lat], 200) // eases camera to new location based on duration
           * this.camera.moveTo([lng, lat]) // snaps camera to new location without any easing
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
           * this.camera.zoomTo(16)
           * this.camera.zoomTo(16, 100)
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
           * this.camera.setCamera({
           *   centerCoordinate: [lng, lat],
           *   zoomLevel: 16,
           *   animationDuration: 2000,
           * })
           *
           * this.camera.setCamera({
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
