import type { HostComponent, ViewProps } from "react-native";
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Double,
  Int32,
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

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

  onPress?: BubblingEventHandler<RegionPayloadFeature>;
  onLongPress?: DirectEventHandler<RegionPayloadFeature>;
  onMapChange?: DirectEventHandler<RegionPayloadFeature>;

}

export default codegenNativeComponent<NativeProps>(
  "MLRNMapView",
) as HostComponent<NativeProps>;
