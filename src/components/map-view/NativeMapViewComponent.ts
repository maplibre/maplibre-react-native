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

type ViewPadding = {
  top?: WithDefault<Int32, 0>;
  right?: WithDefault<Int32, 0>;
  bottom?: WithDefault<Int32, 0>;
  left?: WithDefault<Int32, 0>;
};

type OrnamentViewPosition = {
  top?: WithDefault<Int32, -1>;
  right?: WithDefault<Int32, -1>;
  bottom?: WithDefault<Int32, -1>;
  left?: WithDefault<Int32, -1>;
};

type PressEvent = {
  longitude: Double;
  latitude: Double;
  locationX: Double;
  locationY: Double;
};

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
  attributionPosition?: OrnamentViewPosition;

  logo?: WithDefault<boolean, true>;
  logoPosition?: OrnamentViewPosition;

  compass?: WithDefault<boolean, false>;
  compassPosition?: OrnamentViewPosition;

  onPress?: BubblingEventHandler<PressEvent>;
  onLongPress?: BubblingEventHandler<PressEvent>;

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
