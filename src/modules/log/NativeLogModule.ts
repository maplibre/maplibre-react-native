import type { TurboModule, CodegenTypes } from "react-native";
import { TurboModuleRegistry } from "react-native";

type NativeLogLevel = "error" | "warn" | "info" | "debug" | "verbose";

export interface Spec extends TurboModule {
  setLogLevel(logLevel: NativeLogLevel): void;

  readonly onLog: CodegenTypes.EventEmitter<{
    message: string;
    level: NativeLogLevel;
    tag: string | null;
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNLogModule");
