import type { HostComponent, ViewProps } from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

export type ViewState = {
  longitude: Double;
  latitude: Double;
  zoom: Double;
  pitch: Double;
  bearing: Double;
  bounds: Double[]; // UnsafeMixed<[[west: number, south: number, east: number, north: number]]> ?
  animated: boolean;
  userInteraction: boolean;
};

export interface NativeProps extends ViewProps {
  contentInset?: number[];

  mapStyle?: string;
  mapStyleUrl?: string;

  preferredFramesPerSecond?: Int32;

  localizeLabels?: boolean;

  zoomEnabled?: boolean;

  scrollEnabled?: boolean;

  pitchEnabled?: boolean;

  rotateEnabled?: boolean;

  tintColor?: string;

  attributionEnabled?: boolean;
  attributionPosition?: number[];

  logoEnabled?: boolean;
  logoPosition?: { top: Int32; right: Int32; bottom: Int32; left: Int32 };

  compassEnabled?: boolean;
  compassViewPosition?: Int32;
  compassViewMargins?: { top: Int32; right: Int32; bottom: Int32; left: Int32 };

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
