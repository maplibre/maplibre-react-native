import {
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from "react-native";

export interface NativeProps extends ViewProps {
  mode?: CodegenTypes.WithDefault<"default" | "heading" | "course", "default">;

  androidPreferredFramesPerSecond?: CodegenTypes.WithDefault<
    CodegenTypes.Int32,
    -1
  >;
}

export default codegenNativeComponent<NativeProps>(
  "MLRNNativeUserLocation",
) as HostComponent<NativeProps>;
