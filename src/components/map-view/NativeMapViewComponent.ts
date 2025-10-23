import {
  codegenNativeComponent,
  type ColorValue,
  type HostComponent,
  type ViewProps,
} from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type NativeViewPadding = {
  top?: WithDefault<Int32, 0>;
  right?: WithDefault<Int32, 0>;
  bottom?: WithDefault<Int32, 0>;
  left?: WithDefault<Int32, 0>;
};

type NativeOrnamentViewPosition = {
  top?: WithDefault<Int32, -1>;
  right?: WithDefault<Int32, -1>;
  bottom?: WithDefault<Int32, -1>;
  left?: WithDefault<Int32, -1>;
};

type NativePressEvent = {
  longitude: Double;
  latitude: Double;
  locationX: Double;
  locationY: Double;
};

type NativeViewStateEvent = {
  longitude: Double;
  latitude: Double;
  zoom: Double;
  bearing: Double;
  pitch: Double;
  bounds: UnsafeMixed<
    [west: Double, south: Double, east: Double, north: Double]
  >;

  animated: boolean;
  userInteraction: boolean;
};

export interface NativeProps extends ViewProps {
  mapStyle?: string;
  contentInset?: NativeViewPadding;
  preferredFramesPerSecond?: WithDefault<Int32, -1>;

  dragPan?: WithDefault<boolean, true>;
  touchAndDoubleTapZoom?: WithDefault<boolean, true>;
  touchRotate?: WithDefault<boolean, true>;
  touchPitch?: WithDefault<boolean, true>;

  tintColor?: ColorValue | undefined;

  attribution?: WithDefault<boolean, true>;
  attributionPosition?: NativeOrnamentViewPosition;

  logo?: WithDefault<boolean, true>;
  logoPosition?: NativeOrnamentViewPosition;

  compass?: WithDefault<boolean, false>;
  compassPosition?: NativeOrnamentViewPosition;

  onPress?: BubblingEventHandler<NativePressEvent>;
  onLongPress?: BubblingEventHandler<NativePressEvent>;

  onRegionWillChange?: DirectEventHandler<NativeViewStateEvent>;
  onRegionIsChanging?: DirectEventHandler<NativeViewStateEvent>;
  onRegionDidChange?: DirectEventHandler<NativeViewStateEvent>;

  onWillStartLoadingMap?: DirectEventHandler<null>;
  onDidFinishLoadingMap?: DirectEventHandler<null>;
  onDidFailLoadingMap?: DirectEventHandler<null>;

  onWillStartRenderingFrame?: DirectEventHandler<null>;
  onDidFinishRenderingFrame?: DirectEventHandler<null>;
  onDidFinishRenderingFrameFully?: DirectEventHandler<null>;

  onWillStartRenderingMap?: DirectEventHandler<null>;
  onDidFinishRenderingMap?: DirectEventHandler<null>;
  onDidFinishRenderingMapFully?: DirectEventHandler<null>;

  onDidFinishLoadingStyle?: DirectEventHandler<null>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNMapView",
) as HostComponent<NativeProps>;
