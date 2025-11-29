import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeLogLevel = "error" | "warn" | "info" | "debug" | "verbose";

export interface Spec extends TurboModule {
  setLogLevel(logLevel: NativeLogLevel): void;

  readonly onLog: CodegenTypes.EventEmitter<{
    level: NativeLogLevel;
    tag: string;
    message: string;
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNLogModule");
