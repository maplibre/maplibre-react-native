import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../../types/codegen/UnsafeMixed";

type NativeHitSlop = {
  top?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  right?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  bottom?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  left?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
};

type NativePressEvent = {
  lngLat: UnsafeMixed<
    [longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]
  >;
  point: UnsafeMixed<[x: CodegenTypes.Double, y: CodegenTypes.Double]>;
  features: UnsafeMixed<GeoJSON.Feature[]>;
};

export interface NativeProps extends ViewProps {
  id: string;
  data?: UnsafeMixed<string | GeoJSON.GeoJSON>;

  // hitSlop?: NativeHitSlop;

  cluster?: boolean;
  clusterRadius?: CodegenTypes.Double;
  clusterMaxZoom?: CodegenTypes.Double;
  clusterMinPoints?: CodegenTypes.Int32;
  clusterProperties?: UnsafeMixed<object>;

  maxzoom?: CodegenTypes.Double;
  buffer?: CodegenTypes.Int32;
  tolerance?: CodegenTypes.Double;
  lineMetrics?: boolean;

  onPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;
  onLongPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNShapeSource",
) as HostComponent<NativeProps>;
