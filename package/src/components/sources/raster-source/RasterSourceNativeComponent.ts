import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

type NativeScheme = "xyz" | "tms";

export interface NativeProps extends ViewProps {
  id: string;
  url?: string;
  tiles?: string[];

  minzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  maxzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  scheme?: CodegenTypes.WithDefault<NativeScheme, "xyz">;
  attribution?: string;

  tileSize?: CodegenTypes.WithDefault<CodegenTypes.Int32, 512>;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNRasterSource",
) as HostComponent<NativeProps>;
