import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../../types/codegen/UnsafeMixed";

type NativeHitbox = {
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
  data: string;

  maxzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  buffer?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  tolerance?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  lineMetrics?: CodegenTypes.WithDefault<boolean, false>;

  cluster?: CodegenTypes.WithDefault<boolean, false>;
  clusterRadius?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  clusterMaxZoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  clusterMinPoints?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  clusterProperties?: UnsafeMixed<object>;

  hitbox?: NativeHitbox;
  hasOnPress: boolean;

  onPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNShapeSource",
) as HostComponent<NativeProps>;
