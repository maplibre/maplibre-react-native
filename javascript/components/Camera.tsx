import {NativeModules, requireNativeComponent, ViewProps} from 'react-native';
import React, {
  memo,
  RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
} from 'react';

import {toJSONString} from '../utils';
import * as geoUtils from '../utils/geoUtils';
import {MaplibreGLEvent} from '../types';
import {useNativeRef} from '../hooks/useNativeRef';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNCamera';

export enum UserTrackingMode {
  Follow = 'normal',
  FollowWithHeading = 'compass',
  FollowWithCourse = 'course',
}

export type UserTrackingModeChangeCallback = (
  event: MaplibreGLEvent<
    'usertrackingmodechange',
    {
      followUserLocation: boolean;
      followUserMode: UserTrackingMode | null;
    }
  >,
) => void;

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

  _defaultCamera: RefObject<NativeCameraStop | null>;
  _getMaxBounds: () => string | null;
  _getNativeCameraMode: (config: CameraStop) => NativeAnimationMode;
  _createStopConfig: (
    config: CameraStop,
    ignoreFollowUserLocation?: boolean,
  ) => NativeCameraStop | null;
  _createDefaultCamera: () => NativeCameraStop | null;
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

type NativeAnimationMode = 'flight' | 'ease' | 'linear' | 'none' | 'move';
export type CameraAnimationMode = 'flyTo' | 'easeTo' | 'linearTo' | 'moveTo';

export interface NativeCameraStop extends Required<CameraPadding> {
  mode: NativeAnimationMode;
  pitch?: number;
  heading?: number;
  duration: number;
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

interface CameraProps extends Omit<ViewProps, 'style'>, CameraStop {
  /**
   * If false, the camera will not send any props to the native module. Intended to be used to prevent unnecessary tile fetching and improve performance when the map is not visible. Defaults to true.
   */
  allowUpdates?: boolean;

  /**
   * Default view settings applied on camera
   */
  defaultSettings?: CameraStop;

  /**
   * The minimun zoom level of the map
   */
  minZoomLevel?: number;

  /**
   * The maximun zoom level of the map
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
   * Manually update the camera - helpful for when props did not update, however you still want the camera to move
   */
  triggerKey?: string | number;

  // Triggered when the
  onUserTrackingModeChange?: UserTrackingModeChangeCallback;
}

interface NativeProps extends Omit<CameraProps, 'maxBounds'> {
  maxBounds: string | null;
  stop: NativeCameraStop | null;
  defaultStop: NativeCameraStop | null;
}

const Camera = memo(
  React.forwardRef<CameraRef, CameraProps>(
    (
      {
        allowUpdates = true,
        animationMode = 'easeTo',
        animationDuration = 2000,
        ...rest
      }: CameraProps,
      ref,
    ) => {
      const props = useMemo(() => {
        return {
          allowUpdates,
          animationMode,
          animationDuration,
          ...rest,
        };
      }, [allowUpdates, animationMode, animationDuration, rest]);

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
          _defaultCamera,
          _getMaxBounds,
          _getNativeCameraMode,
          _createStopConfig,
          _createDefaultCamera,
        }),
      );

      const _defaultCamera = useRef<NativeCameraStop | null>(null);

      const cameraRef = useNativeRef<NativeProps>();

      const _createStopConfig = useCallback(
        (
          config: CameraStop = {},
          ignoreFollowUserLocation = false,
        ): NativeCameraStop | null => {
          if (props.followUserLocation && !ignoreFollowUserLocation) {
            return null;
          }

          const stopConfig: NativeCameraStop = {
            mode: _getNativeCameraMode(config),
            pitch: config.pitch,
            heading: config.heading,
            duration: config.animationDuration || 0,
            zoom: config.zoomLevel,
            paddingTop:
              config.padding?.paddingTop || config.bounds?.paddingTop || 0,
            paddingRight:
              config.padding?.paddingRight || config.bounds?.paddingRight || 0,
            paddingBottom:
              config.padding?.paddingBottom ||
              config.bounds?.paddingBottom ||
              0,
            paddingLeft:
              config.padding?.paddingLeft || config.bounds?.paddingLeft || 0,
          };

          if (config.centerCoordinate) {
            stopConfig.centerCoordinate = toJSONString(
              geoUtils.makePoint(config.centerCoordinate),
            );
          }

          if (config.bounds && config.bounds.ne && config.bounds.sw) {
            const {ne, sw} = config.bounds;
            stopConfig.bounds = toJSONString(geoUtils.makeLatLngBounds(ne, sw));
          }

          return stopConfig;
        },
        [props.followUserLocation],
      );

      const _setCamera = useCallback(
        (config: CameraStop | CameraStops = {}): void => {
          if ('stops' in config) {
            let nativeStops: NativeCameraStop[] = [];

            for (const stop of config.stops) {
              const nativeStop = _createStopConfig(stop);
              if (nativeStop) {
                nativeStops = [...nativeStops, nativeStop];
              }
            }
            cameraRef.current?.setNativeProps({stop: {stops: nativeStops}});
          } else {
            const nativeStop = _createStopConfig(config);

            if (nativeStop) {
              cameraRef.current?.setNativeProps({stop: nativeStop});
            }
          }
        },
        [cameraRef.current, _createStopConfig],
      );

      const _getMaxBounds = useCallback((): string | null => {
        const bounds = props.maxBounds;
        if (!bounds || !bounds.ne || !bounds.sw) {
          return null;
        }
        return toJSONString(geoUtils.makeLatLngBounds(bounds.ne, bounds.sw));
      }, [props.maxBounds]);

      useEffect(() => {
        if (!props.allowUpdates) {
          return;
        }

        cameraRef.current?.setNativeProps({
          followUserLocation: props.followUserLocation,
        });
      }, [cameraRef.current, props.followUserLocation]);

      useEffect(() => {
        if (!props.maxBounds || !props.allowUpdates) {
          return;
        }

        cameraRef.current?.setNativeProps({
          maxBounds: _getMaxBounds(),
        });
      }, [cameraRef.current, props.maxBounds, _getMaxBounds]);

      useEffect(() => {
        if (!props.minZoomLevel || !props.allowUpdates) {
          return;
        }

        cameraRef.current?.setNativeProps({
          minZoomLevel: props.minZoomLevel,
        });
      }, [cameraRef.current, props.minZoomLevel]);

      useEffect(() => {
        if (!props.maxZoomLevel || !props.allowUpdates) {
          return;
        }

        cameraRef.current?.setNativeProps({
          maxZoomLevel: props.maxZoomLevel,
        });
      }, [cameraRef.current, props.maxZoomLevel]);

      useEffect(() => {
        if (!props.allowUpdates) {
          return;
        }

        if (!props.followUserLocation) {
          return;
        }

        cameraRef.current?.setNativeProps({
          followUserMode: props.followUserMode,
          followPitch: props.followPitch || props.pitch,
          followHeading: props.followHeading || props.heading,
          followZoomLevel: props.followZoomLevel || props.zoomLevel,
        });
      }, [
        cameraRef.current,
        props.allowUpdates,
        props.followUserLocation,
        props.followUserMode,
        props.followPitch,
        props.pitch,
        props.followHeading,
        props.heading,
        props.followZoomLevel,
        props.zoomLevel,
      ]);

      const cameraConfig: CameraStop = useMemo(() => {
        return {
          bounds: props.bounds,
          centerCoordinate: props.centerCoordinate,
          padding: props.padding,
          zoomLevel: props.zoomLevel,
          minZoomLevel: props.minZoomLevel,
          maxZoomLevel: props.maxZoomLevel,
          pitch: props.pitch,
          heading: props.heading,
          animationMode: props.animationMode,
          animationDuration: props.animationDuration,
        };
      }, [
        props.bounds,
        props.centerCoordinate,
        props.padding,
        props.zoomLevel,
        props.minZoomLevel,
        props.maxZoomLevel,
        props.pitch,
        props.heading,
        props.animationMode,
        props.animationDuration,
      ]);

      useEffect(() => {
        if (!props.allowUpdates) {
          return;
        }

        _setCamera(cameraConfig);
      }, [_setCamera, cameraConfig]);

      const fitBounds = (
        northEastCoordinates: GeoJSON.Position,
        southWestCoordinates: GeoJSON.Position,
        padding: number | number[] = 0,
        animationDuration: number = 0.0,
      ): void => {
        const pad = {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
        };

        if (Array.isArray(padding)) {
          if (padding.length === 2) {
            pad.paddingTop = padding[0];
            pad.paddingBottom = padding[0];
            pad.paddingLeft = padding[1];
            pad.paddingRight = padding[1];
          } else if (padding.length === 4) {
            pad.paddingTop = padding[0];
            pad.paddingRight = padding[1];
            pad.paddingBottom = padding[2];
            pad.paddingLeft = padding[3];
          }
        } else {
          pad.paddingLeft = padding;
          pad.paddingRight = padding;
          pad.paddingTop = padding;
          pad.paddingBottom = padding;
        }

        setCamera({
          bounds: {
            ne: northEastCoordinates,
            sw: southWestCoordinates,
          },
          padding: pad,
          animationDuration: animationDuration,
          animationMode: 'easeTo',
        });
      };

      const flyTo = (
        coordinates: GeoJSON.Position,
        animationDuration = 2000,
      ): void => {
        setCamera({
          centerCoordinate: coordinates,
          animationDuration,
          animationMode: 'flyTo',
        });
      };

      const moveTo = (
        coordinates: GeoJSON.Position,
        animationDuration = 0,
      ): void => {
        setCamera({
          centerCoordinate: coordinates,
          animationDuration,
        });
      };

      const zoomTo = (zoomLevel: number, animationDuration = 2000): void => {
        setCamera({
          zoomLevel,
          animationDuration,
          animationMode: 'flyTo',
        });
      };

      const setCamera = (config: CameraStop | CameraStops = {}): void => {
        _setCamera(config);
      };

      const _createDefaultCamera = (): NativeCameraStop | null => {
        if (_defaultCamera.current) {
          return _defaultCamera.current;
        }
        if (!props.defaultSettings) {
          return null;
        }

        _defaultCamera.current = _createStopConfig(
          {
            ...props.defaultSettings,
            animationMode: 'moveTo',
          },
          true,
        );
        return _defaultCamera.current;
      };

      const _getNativeCameraMode = (
        config: CameraStop,
      ): NativeAnimationMode => {
        switch (config.animationMode) {
          case 'flyTo':
            return MapLibreGL.CameraModes.Flight;
          case 'moveTo':
            return MapLibreGL.CameraModes.None;
          case 'linearTo':
            return MapLibreGL.CameraModes.Linear;
          default:
            return MapLibreGL.CameraModes.Ease;
        }
      };

      const nativeProps = Object.assign({}, props);

      const callbacks = {
        onUserTrackingModeChange: nativeProps.onUserTrackingModeChange,
      };

      return (
        <RCTMLNCamera
          testID="Camera"
          ref={cameraRef}
          followUserLocation={props.followUserLocation}
          followUserMode={props.followUserMode}
          followPitch={props.followPitch}
          followHeading={props.followHeading}
          followZoomLevel={props.followZoomLevel}
          stop={_createStopConfig(nativeProps)}
          maxZoomLevel={props.maxZoomLevel}
          minZoomLevel={props.minZoomLevel}
          maxBounds={_getMaxBounds()}
          defaultStop={_createDefaultCamera()}
          {...callbacks}
        />
      );
    },
  ),
);

const RCTMLNCamera = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default Camera;
