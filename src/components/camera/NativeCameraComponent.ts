import type { HostComponent, ViewProps } from "react-native";
import type {
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

// START: NativeCameraStop
export type NativeViewPadding = {
  top?: WithDefault<Int32, 0>;
  right?: WithDefault<Int32, 0>;
  bottom?: WithDefault<Int32, 0>;
  left?: WithDefault<Int32, 0>;
};

type NativeViewState = {
  longitude?: WithDefault<Double, -360>;
  latitude?: WithDefault<Double, -360>;

  bounds?: Double[];

  padding?: NativeViewPadding;
  zoom?: WithDefault<Double, -1>;
  bearing?: WithDefault<Double, -1>;
  pitch?: WithDefault<Double, -1>;
};

type NativeEasingMode = "none" | "linear" | "ease" | "fly";

export type NativeCameraStop = NativeViewState & {
  duration?: WithDefault<Int32, -1>;
  easing?: WithDefault<NativeEasingMode, "none">;
};
// END: NativeCameraStop

type NativeTrackUserLocationMode = "none" | "default" | "heading" | "course";

export type TrackUserLocationChangeEvent = {
  trackUserLocation?: string;
};

export interface NativeProps extends ViewProps {
  stop?: NativeCameraStop;

  initialViewState?: NativeViewState;

  minZoom?: WithDefault<Double, -1>;
  maxZoom?: WithDefault<Double, -1>;
  maxBounds?: Double[];

  trackUserLocation?: WithDefault<NativeTrackUserLocationMode, "none">;

  onTrackUserLocationChange?: DirectEventHandler<TrackUserLocationChangeEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNCamera",
) as HostComponent<NativeProps>;
