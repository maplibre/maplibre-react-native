import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  addHeader(headerName: string, headerValue: string): void;

  removeHeader(headerName: string): void;

  setConnected(connected: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNRequestModule");
