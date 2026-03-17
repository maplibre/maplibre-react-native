import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

import type { UnsafeMixed } from "../../../types/codegen/UnsafeMixed";

type NativeScheme = "xyz" | "tms";

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
  url?: string;
  tiles?: string[];

  minzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  maxzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  scheme?: CodegenTypes.WithDefault<NativeScheme, "xyz">;
  attribution?: string;

  hitbox?: NativeHitbox;
  hasOnPress: boolean;

  onPress?: CodegenTypes.BubblingEventHandler<NativePressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNVectorSource",
) as HostComponent<NativeProps>;
