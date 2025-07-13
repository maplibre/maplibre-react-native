import type { HostComponent, ViewProps } from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
  UnsafeObject,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { UnsafeMixed } from "../../types/codegen/UnsafeMixed";

type RegionPayloadFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: Double[];
  };
  properties: {
    zoomLevel: Double;
    heading: Double;
    animated: boolean;
    isUserInteraction: boolean;
    visibleBounds: Double[];
    pitch: Double;
  };
};

export interface NativeProps extends ViewProps {
  contentInset?: number[];

  mapStyle?: UnsafeMixed<object>;
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

  onPress?: BubblingEventHandler<RegionPayloadFeature>;
  onLongPress?: DirectEventHandler<RegionPayloadFeature>;
  onMapChange?: DirectEventHandler<RegionPayloadFeature>;

  // OLD

  // attributionEnabled?: OptionalProp<boolean>;
  // attributionPosition?: UnsafeMixed<any>;
  //
  // logoEnabled?: OptionalProp<boolean>;
  // logoPosition?: UnsafeMixed<any>;
  //
  // compassEnabled?: OptionalProp<boolean>;
  // compassFadeWhenNorth?: OptionalProp<boolean>;
  // compassPosition?: UnsafeMixed<any>;
  // compassViewPosition?: OptionalProp<Int32>;
  // compassViewMargins?: OptionalProp<Point>;
  //
  // scaleBarEnabled?: OptionalProp<boolean>;
  // scaleBarPosition?: UnsafeMixed<any>;
  //
  // zoomEnabled?: OptionalProp<boolean>;
  // scrollEnabled?: OptionalProp<boolean>;
  // rotateEnabled?: OptionalProp<boolean>;
  // pitchEnabled?: OptionalProp<boolean>;
  //
  // deselectAnnotationOnTap?: OptionalProp<boolean>;
  //
  // requestDisallowInterceptTouchEvent?: OptionalProp<boolean>;
  //
  // projection?: OptionalProp<"mercator" | "globe">;
  //
  // // Android only
  // surfaceView?: OptionalProp<boolean>;
  // scaleBarViewMargins?: UnsafeMixed<any>;
  // attributionViewMargins?: UnsafeMixed<any>;
  // attributionViewPosition?: UnsafeMixed<any>;
  //
  // // iOS only
  // compassImage?: OptionalProp<string>;
  //
  // onPress?: BubblingEventHandler<OnPressEventType>;
  // onLongPress?: DirectEventHandler<OnPressEventType>;
  // onMapChange?: DirectEventHandler<OnMapChangeEventType>;
  // onCameraChanged?: DirectEventHandler<OnCameraChangedEventType>;
  //
  // mapViewImpl?: OptionalProp<string>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNMapView",
) as HostComponent<NativeProps>;
