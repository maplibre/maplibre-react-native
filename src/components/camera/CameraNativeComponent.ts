import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

// START: NativeCameraStop
export type NativeViewPadding = {
  top?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  right?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  bottom?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  left?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
};

type NativeViewState = {
  longitude?: CodegenTypes.WithDefault<CodegenTypes.Double, -360>;
  latitude?: CodegenTypes.WithDefault<CodegenTypes.Double, -360>;

  bounds?: CodegenTypes.Double[];

  padding?: NativeViewPadding;
  zoom?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  bearing?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  pitch?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
};

type NativeEasingMode = "none" | "linear" | "ease" | "fly";

export type NativeCameraStop = NativeViewState & {
  duration?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  easing?: CodegenTypes.WithDefault<NativeEasingMode, "none">;
};
// END: NativeCameraStop

type NativeTrackUserLocationMode = "none" | "default" | "heading" | "course";

export type TrackUserLocationChangeEvent = {
  trackUserLocation?: string;
};

export interface NativeProps extends ViewProps {
  stop?: NativeCameraStop;

  initialViewState?: NativeViewState;

  minZoom?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  maxZoom?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  maxBounds?: CodegenTypes.Double[];

  trackUserLocation?: CodegenTypes.WithDefault<
    NativeTrackUserLocationMode,
    "none"
  >;

  onTrackUserLocationChange?: CodegenTypes.DirectEventHandler<TrackUserLocationChangeEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNCamera",
) as HostComponent<NativeProps>;
