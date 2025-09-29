import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import {
  type Double,
  type Int32,
  type WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";

// START: NativeCameraStop
export type NativeViewPadding = {
  top?: WithDefault<Int32, 0>;
  right?: WithDefault<Int32, 0>;
  bottom?: WithDefault<Int32, 0>;
  left?: WithDefault<Int32, 0>;
};

type NativeViewState = {
  longitude?: WithDefault<Double, -360>;
  latitude?: WithDefault<Double, -360>;

  bounds?: Double[];

  padding?: NativeViewPadding;
  zoom?: WithDefault<Double, -1>;
  bearing?: WithDefault<Double, -1>;
  pitch?: WithDefault<Double, -1>;
};

type NativeEasingMode = "none" | "linear" | "ease" | "fly";

export type NativeCameraStop = NativeViewState & {
  duration?: WithDefault<Int32, -1>;
  easing?: WithDefault<NativeEasingMode, "none">;
};
// END: NativeCameraStop

export interface Spec extends TurboModule {
  setStop(reactTag: Int32, stop: NativeCameraStop): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNCameraModule");
