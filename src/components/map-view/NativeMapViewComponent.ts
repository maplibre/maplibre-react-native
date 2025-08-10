import type { ColorValue, HostComponent, ViewProps } from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

export type ViewState = {
  longitude: Double;
  latitude: Double;
  zoom: Double;
  bearing: Double;
  pitch: Double;
  bounds: Double[]; // UnsafeMixed<[[west: number, south: number, east: number, north: number]]> ?
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
  localizeLabels?: WithDefault<boolean, false>;
  contentInset?: ViewPadding;
  preferredFramesPerSecond?: Int32;

  scrollEnabled?: WithDefault<boolean, true>;
  zoomEnabled?: WithDefault<boolean, true>;
  rotateEnabled?: WithDefault<boolean, true>;
  pitchEnabled?: WithDefault<boolean, true>;

  tintColor?: ColorValue | undefined;

  attribution?: WithDefault<boolean, true>;
  attributionPosition?: ViewPadding; // UnsafeMixed<ViewPosition>

  logo?: WithDefault<boolean, true>;
  logoPosition?: ViewPadding; // UnsafeMixed<ViewPosition>

  compass?: WithDefault<boolean, false>;
  compassPosition?: ViewPadding; // UnsafeMixed<ViewPosition>

  onPress?: BubblingEventHandler<ViewState>;
  onLongPress?: DirectEventHandler<ViewState>;

  onRegionWillChange?: DirectEventHandler<ViewState>;
  onRegionIsChanging?: DirectEventHandler<ViewState>;
  onRegionDidChange?: DirectEventHandler<ViewState>;

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
