import {toJSONString, existenceChange} from '../utils';
import * as geoUtils from '../utils/geoUtils';
import {MaplibreGLEvent} from '../types';

import {
  NativeMethods,
  NativeModules,
  requireNativeComponent,
  ViewProps,
} from 'react-native';
import React, {Component, MutableRefObject, ReactElement} from 'react';

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

class Camera extends React.Component<CameraProps> {
  static defaultProps = {
    allowUpdates: true,
    animationMode: 'easeTo',
    animationDuration: 2000,
  };

  defaultCamera: NativeCameraStop | null = null;
  cameraRef: MutableRefObject<
    (Component<NativeProps> & Readonly<NativeMethods>) | null
  >;

  constructor(props: CameraProps) {
    super(props);
    this.cameraRef = React.createRef<
      Component<NativeProps> & Readonly<NativeMethods>
    >();
  }

  UNSAFE_componentWillReceiveProps(nextProps: CameraProps): void {
    this._handleCameraChange(this.props, nextProps);
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  _handleCameraChange(
    currentCamera: CameraProps,
    nextCamera: CameraProps,
  ): void {
    const c = currentCamera;
    const n = nextCamera;

    if (!n.allowUpdates) {
      return;
    }

    const hasCameraChanged = this._hasCameraChanged(c, n);
    if (!hasCameraChanged) {
      return;
    }

    if (c.followUserLocation && !n.followUserLocation) {
      this.cameraRef.current?.setNativeProps({followUserLocation: false});
      return;
    }
    if (!c.followUserLocation && n.followUserLocation) {
      this.cameraRef.current?.setNativeProps({followUserLocation: true});
    }

    if (n.followUserLocation) {
      this.cameraRef.current?.setNativeProps({
        followUserMode: n.followUserMode,
        followPitch: n.followPitch || n.pitch,
        followHeading: n.followHeading || n.heading,
        followZoomLevel: n.followZoomLevel || n.zoomLevel,
      });
      return;
    }

    if (n.maxBounds) {
      this.cameraRef.current?.setNativeProps({
        maxBounds: this._getMaxBounds(),
      });
    }
    if (n.minZoomLevel) {
      this.cameraRef.current?.setNativeProps({
        minZoomLevel: this.props.minZoomLevel,
      });
    }
    if (n.maxZoomLevel) {
      this.cameraRef.current?.setNativeProps({
        maxZoomLevel: this.props.maxZoomLevel,
      });
    }

    const cameraConfig: CameraStop = {
      bounds: undefined,
      centerCoordinate: undefined,
      padding: n.padding,
      zoomLevel: n.zoomLevel,
      pitch: n.pitch,
      heading: n.heading,
      animationMode: n.animationMode,
      animationDuration: n.animationDuration,
    };

    const boundsChanged = this._hasBoundsChanged(c.bounds, n.bounds);
    const centerCoordinateChanged = this._hasCenterCoordinateChanged(
      c.centerCoordinate,
      n.centerCoordinate,
    );
    const paddingChanged = this._hasPaddingChanged(c.padding, n.padding);
    const zoomChanged = this._hasNumberChanged(c.zoomLevel, n.zoomLevel);
    const pitchChanged = this._hasNumberChanged(c.pitch, n.pitch);
    const headingChanged = this._hasNumberChanged(c.heading, n.heading);

    let shouldUpdate = false;

    if (n.bounds && boundsChanged) {
      cameraConfig.bounds = n.bounds;
      shouldUpdate = true;
    } else if (n.centerCoordinate && centerCoordinateChanged) {
      cameraConfig.centerCoordinate = n.centerCoordinate;
      shouldUpdate = true;
    }

    if (paddingChanged || zoomChanged || pitchChanged || headingChanged) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this._setCamera(cameraConfig);
    }
  }

  _hasCameraChanged(
    currentCamera: CameraProps,
    nextCamera: CameraProps,
  ): boolean {
    const c = currentCamera;
    const n = nextCamera;

    const hasDefaultPropsChanged =
      c.heading !== n.heading ||
      this._hasCenterCoordinateChanged(
        c?.centerCoordinate,
        n?.centerCoordinate,
      ) ||
      this._hasBoundsChanged(c.bounds, n.bounds) ||
      this._hasPaddingChanged(c.padding, n.padding) ||
      c.pitch !== n.pitch ||
      c.zoomLevel !== n.zoomLevel ||
      c.triggerKey !== n.triggerKey;

    const hasFollowPropsChanged =
      c.followUserLocation !== n.followUserLocation ||
      c.followUserMode !== n.followUserMode ||
      c.followZoomLevel !== n.followZoomLevel ||
      c.followHeading !== n.followHeading ||
      c.followPitch !== n.followPitch;

    const hasAnimationPropsChanged =
      c.animationMode !== n.animationMode ||
      c.animationDuration !== n.animationDuration;

    const hasNavigationConstraintsPropsChanged =
      this._hasBoundsChanged(c.maxBounds, n.maxBounds) ||
      c.minZoomLevel !== n.minZoomLevel ||
      c.maxZoomLevel !== n.maxZoomLevel;

    return (
      hasDefaultPropsChanged ||
      hasFollowPropsChanged ||
      hasAnimationPropsChanged ||
      hasNavigationConstraintsPropsChanged
    );
  }

  _hasCenterCoordinateChanged(
    cC?: GeoJSON.Position,
    nC?: GeoJSON.Position,
  ): boolean {
    if (!cC && !nC) {
      return false;
    }

    if (existenceChange(!!cC, !!nC)) {
      return true;
    }

    const isLngDiff = cC?.[0] !== nC?.[0];
    const isLatDiff = cC?.[1] !== nC?.[1];
    return isLngDiff || isLatDiff;
  }

  _hasBoundsChanged(
    cB?: CameraBoundsWithPadding,
    nB?: CameraBoundsWithPadding,
  ): boolean {
    if (!cB && !nB) {
      return false;
    }

    if (existenceChange(!!cB, !!nB)) {
      return true;
    }

    return (
      cB?.ne[0] !== nB?.ne[0] ||
      cB?.ne[1] !== nB?.ne[1] ||
      cB?.sw[0] !== nB?.sw[0] ||
      cB?.sw[1] !== nB?.sw[1] ||
      cB?.paddingTop !== nB?.paddingTop ||
      cB?.paddingLeft !== nB?.paddingLeft ||
      cB?.paddingRight !== nB?.paddingRight ||
      cB?.paddingBottom !== nB?.paddingBottom
    );
  }

  _hasPaddingChanged(cP?: CameraPadding, nP?: CameraPadding): boolean {
    if (!cP && !nP) {
      return false;
    }

    if (existenceChange(!!cP, !!nP)) {
      return true;
    }

    return (
      cP?.paddingTop !== nP?.paddingTop ||
      cP?.paddingLeft !== nP?.paddingLeft ||
      cP?.paddingRight !== nP?.paddingRight ||
      cP?.paddingBottom !== nP?.paddingBottom
    );
  }

  _hasNumberChanged(prev?: number, next?: number): boolean {
    if (existenceChange(!!prev, !!next)) {
      return true;
    }

    if (!prev && !next) {
      return false;
    }

    return prev !== next;
  }

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
   * @param {Number=} padding - Camera padding for bound
   * @param {Number=} animationDuration - Duration of camera animation
   * @return {void}
   */
  fitBounds(
    northEastCoordinates: number[],
    southWestCoordinates: number[],
    padding = 0,
    animationDuration = 0.0,
  ): void {
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

    this.setCamera({
      bounds: {
        ne: northEastCoordinates,
        sw: southWestCoordinates,
      },
      padding: pad,
      animationDuration,
      animationMode: 'easeTo',
    });
  }

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
  flyTo(coordinates: GeoJSON.Position, animationDuration = 2000): void {
    this.setCamera({
      centerCoordinate: coordinates,
      animationDuration,
      animationMode: 'flyTo',
    });
  }

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
  moveTo(coordinates: GeoJSON.Position, animationDuration = 0): void {
    this.setCamera({
      centerCoordinate: coordinates,
      animationDuration,
    });
  }

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
  zoomTo(zoomLevel: number, animationDuration = 2000): void {
    this.setCamera({
      zoomLevel,
      animationDuration,
      animationMode: 'flyTo',
    });
  }

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
  setCamera(config: CameraStop | CameraStops = {}): void {
    this._setCamera(config);
  }

  _setCamera(config: CameraStop | CameraStops = {}): void {
    if ('stops' in config) {
      let nativeStops: NativeCameraStop[] = [];

      for (const stop of config.stops) {
        const nativeStop = this._createStopConfig(stop);
        if (nativeStop) {
          nativeStops = [...nativeStops, nativeStop];
        }
      }
      this.cameraRef.current?.setNativeProps({stop: {stops: nativeStops}});
    } else {
      const nativeStop = this._createStopConfig(config);
      if (nativeStop) {
        this.cameraRef.current?.setNativeProps({stop: nativeStop});
      }
    }
  }

  _createDefaultCamera(): NativeCameraStop | null {
    if (this.defaultCamera) {
      return this.defaultCamera;
    }
    if (!this.props.defaultSettings) {
      return null;
    }

    this.defaultCamera = this._createStopConfig(
      {
        ...this.props.defaultSettings,
        animationMode: 'moveTo',
      },
      true,
    );
    return this.defaultCamera;
  }

  _createStopConfig(
    config: CameraStop = {},
    ignoreFollowUserLocation = false,
  ): NativeCameraStop | null {
    if (this.props.followUserLocation && !ignoreFollowUserLocation) {
      return null;
    }

    const stopConfig: NativeCameraStop = {
      mode: this._getNativeCameraMode(config),
      pitch: config.pitch,
      heading: config.heading,
      duration: config.animationDuration || 0,
      zoom: config.zoomLevel,
      paddingTop: config.padding?.paddingTop || config.bounds?.paddingTop || 0,
      paddingRight:
        config.padding?.paddingRight || config.bounds?.paddingRight || 0,
      paddingBottom:
        config.padding?.paddingBottom || config.bounds?.paddingBottom || 0,
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
  }

  _getNativeCameraMode(config: CameraStop): NativeAnimationMode {
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
  }

  _getMaxBounds(): string | null {
    const bounds = this.props.maxBounds;
    if (!bounds || !bounds.ne || !bounds.sw) {
      return null;
    }
    return toJSONString(geoUtils.makeLatLngBounds(bounds.ne, bounds.sw));
  }

  render(): ReactElement {
    const props = Object.assign({}, this.props);

    const callbacks = {
      onUserTrackingModeChange: props.onUserTrackingModeChange,
    };

    return (
      <RCTMLNCamera
        testID="Camera"
        ref={this.cameraRef}
        followUserLocation={this.props.followUserLocation}
        followUserMode={this.props.followUserMode}
        followPitch={this.props.followPitch}
        followHeading={this.props.followHeading}
        followZoomLevel={this.props.followZoomLevel}
        stop={this._createStopConfig(props)}
        maxZoomLevel={this.props.maxZoomLevel}
        minZoomLevel={this.props.minZoomLevel}
        maxBounds={this._getMaxBounds()}
        defaultStop={this._createDefaultCamera()}
        {...callbacks}
      />
    );
  }
}

const RCTMLNCamera = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default Camera;
