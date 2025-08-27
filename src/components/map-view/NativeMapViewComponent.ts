import type { ColorValue, HostComponent, ViewProps } from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type ViewStateEvent = {
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

export type ViewPadding = {
  top: Int32;
  right: Int32;
  bottom: Int32;
  left: Int32;
};

export type ViewPosition =
  | { top: Int32; left: Int32 }
  | { top: Int32; right: Int32 }
  | { bottom: Int32; right: Int32 }
  | { bottom: Int32; left: Int32 };

export interface NativeProps extends ViewProps {
  mapStyle?: string;
  contentInset?: ViewPadding;
  preferredFramesPerSecond?: Int32;

  scrollEnabled?: WithDefault<boolean, true>;
  zoomEnabled?: WithDefault<boolean, true>;
  rotateEnabled?: WithDefault<boolean, true>;
  pitchEnabled?: WithDefault<boolean, true>;

  tintColor?: ColorValue | undefined;

  attribution?: WithDefault<boolean, true>;
  attributionPosition?: UnsafeMixed<ViewPosition>;

  logo?: WithDefault<boolean, true>;
  logoPosition?: UnsafeMixed<ViewPosition>;

  compass?: WithDefault<boolean, false>;
  compassPosition?: UnsafeMixed<ViewPosition>;

  onPress?: BubblingEventHandler<ViewStateEvent>;
  onLongPress?: DirectEventHandler<ViewStateEvent>;

  onRegionWillChange?: DirectEventHandler<ViewStateEvent>;
  onRegionIsChanging?: DirectEventHandler<ViewStateEvent>;
  onRegionDidChange?: DirectEventHandler<ViewStateEvent>;

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
