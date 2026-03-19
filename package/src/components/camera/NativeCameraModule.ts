import {
  TurboModuleRegistry,
  type CodegenTypes,
  type TurboModule,
} from "react-native";

// START: NativeCameraStop
type NativeViewPadding = {
  top?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  right?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  bottom?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  left?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
};

type NativeViewState = {
  center?: CodegenTypes.Double[];

  bounds?: CodegenTypes.Double[];

  padding?: NativeViewPadding;
  zoom?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  bearing?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
  pitch?: CodegenTypes.WithDefault<CodegenTypes.Double, -1>;
};

type NativeEasingMode = "none" | "linear" | "ease" | "fly";

type NativeCameraStop = NativeViewState & {
  duration?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  easing?: CodegenTypes.WithDefault<NativeEasingMode, "none">;
};
// END: NativeCameraStop

export interface Spec extends TurboModule {
  setStop(reactTag: CodegenTypes.Int32, stop: NativeCameraStop): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNCameraModule");
