import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { type Int32 } from "react-native/Libraries/Types/CodegenTypes";

import type { NativeCameraStop } from "./NativeCameraComponent";

export interface Spec extends TurboModule {
  setCamera(viewRef: Int32 | null, stops: NativeCameraStop[]): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNCameraModule");
