import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

type NativeDEMEncoding = "mapbox" | "terrarium";

export interface NativeProps extends ViewProps {
  id: string;
  url?: string;
  tiles?: string[];

  tileSize?: CodegenTypes.WithDefault<CodegenTypes.Int32, 512>;
  minzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  maxzoom?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  attribution?: string;

  encoding?: CodegenTypes.WithDefault<NativeDEMEncoding, "mapbox">;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNRasterDEMSource",
) as HostComponent<NativeProps>;
