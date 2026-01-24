import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ColorValue,
  type ViewProps,
} from "react-native";

import type { LightLayerStyle } from "../../types/MapLibreRNStyles";
import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type NativeViewPadding = {
  top?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  right?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  bottom?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  left?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
};

type NativeOrnamentViewPosition = {
  top?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  right?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  bottom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  left?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
};

type NativePressEvent = {
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  point: UnsafeMixed<[x: CodegenTypes.Double, y: CodegenTypes.Double]>;
};

type NativeViewStateEvent = {
  center: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  zoom: CodegenTypes.Double;
  bearing: CodegenTypes.Double;
  pitch: CodegenTypes.Double;
  bounds: UnsafeMixed<
    [
      west: CodegenTypes.Double,
      south: CodegenTypes.Double,
      east: CodegenTypes.Double,
      north: CodegenTypes.Double,
    ]
  >;

  animated: boolean;
  userInteraction: boolean;
};

export interface NativeProps extends ViewProps {
  mapStyle: string;
  light?: UnsafeMixed<LightLayerStyle>;
  contentInset?: NativeViewPadding;
  preferredFramesPerSecond?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;

  dragPan?: CodegenTypes.WithDefault<boolean, true>;
  touchAndDoubleTapZoom?: CodegenTypes.WithDefault<boolean, true>;
  touchRotate?: CodegenTypes.WithDefault<boolean, true>;
  touchPitch?: CodegenTypes.WithDefault<boolean, true>;

  tintColor?: ColorValue | undefined;

  attribution?: CodegenTypes.WithDefault<boolean, true>;
  attributionPosition?: NativeOrnamentViewPosition;

  logo?: CodegenTypes.WithDefault<boolean, true>;
  logoPosition?: NativeOrnamentViewPosition;

  compass?: CodegenTypes.WithDefault<boolean, false>;
  compassPosition?: NativeOrnamentViewPosition;
  compassHiddenFacingNorth?: CodegenTypes.WithDefault<boolean, true>;

  onPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;
  onLongPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;

  onRegionWillChange?: CodegenTypes.DirectEventHandler<NativeViewStateEvent>;
  onRegionIsChanging?: CodegenTypes.DirectEventHandler<NativeViewStateEvent>;
  onRegionDidChange?: CodegenTypes.DirectEventHandler<NativeViewStateEvent>;

  onWillStartLoadingMap?: CodegenTypes.DirectEventHandler<null>;
  onDidFinishLoadingMap?: CodegenTypes.DirectEventHandler<null>;
  onDidFailLoadingMap?: CodegenTypes.DirectEventHandler<null>;

  onWillStartRenderingFrame?: CodegenTypes.DirectEventHandler<null>;
  onDidFinishRenderingFrame?: CodegenTypes.DirectEventHandler<null>;
  onDidFinishRenderingFrameFully?: CodegenTypes.DirectEventHandler<null>;

  onWillStartRenderingMap?: CodegenTypes.DirectEventHandler<null>;
  onDidFinishRenderingMap?: CodegenTypes.DirectEventHandler<null>;
  onDidFinishRenderingMapFully?: CodegenTypes.DirectEventHandler<null>;

  onDidFinishLoadingStyle?: CodegenTypes.DirectEventHandler<null>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNMapView",
) as HostComponent<NativeProps>;
