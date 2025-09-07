import type { HostComponent, ViewProps } from "react-native";
import type {
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type NativeCameraMode = "flight" | "ease" | "linear" | "none";

export type NativeViewPadding = {
  top?: WithDefault<Int32, 0>;
  right?: WithDefault<Int32, 0>;
  bottom?: WithDefault<Int32, 0>;
  left?: WithDefault<Int32, 0>;
};

export type NativeCameraStop = {
  center?: {
    longitude: Double;
    latitude: Double;
  };

  zoom?: Double;
  bearing?: Double;
  pitch?: Double;

  bounds?: Double[];
  padding?: NativeViewPadding;

  duration?: Int32;
  mode?: WithDefault<NativeCameraMode, "">;
};

/**
 * TODO: Move to codegen include?
 *
 * TODO: CLARIFY
 * In fabric type spec we use compassEnabled?: OptionalProp<boolean> instead of
 * compassEnabled?: boolean. Fabric converts those optional to boolean, with
 * default values, but when we render MapView without compassEnabled we want it
 * o be rendered what's the default by Mapbox, so null.
 * https://github.com/rnmapbox/maps/pull/3082#discussion_r1339858750
 */
export type OptionalProp<T> = UnsafeMixed<T>;

export type TrackUserLocationMode = "default" | "heading" | "course";

export type TrackUserLocationChangeEvent = {
  trackUserLocation?: TrackUserLocationMode;
};

export interface NativeProps extends ViewProps {
  initialViewState?: NativeCameraStop;

  // zoom?: Double;
  // bearing?: Double;
  // pitch?: Double;
  //
  // duration?: Int32;
  // mode?: NativeCameraMode;

  minZoom?: Double;
  maxZoom?: Double;
  maxBounds?: Double[];

  trackUserLocation?: TrackUserLocationMode;

  onTrackUserLocationChange?: DirectEventHandler<TrackUserLocationChangeEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNCamera",
) as HostComponent<NativeProps>;
