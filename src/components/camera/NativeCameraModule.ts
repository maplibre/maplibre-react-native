import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { type Int32 } from "react-native/Libraries/Types/CodegenTypes";

type ViewRef = Int32 | null;

type NativeAnimationMode = 1 | 2 | 3 | 4;

interface NativeCameraStop {
  centerCoordinate?: string;
  zoom?: number;

  bounds?: string;

  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  heading?: number;
  pitch?: number;

  duration?: number;
  mode?: NativeAnimationMode;
}

export interface Spec extends TurboModule {
  setCamera(viewRef: ViewRef, stops: NativeCameraStop[]): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNCameraModule");
