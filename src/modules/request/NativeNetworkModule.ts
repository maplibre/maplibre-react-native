import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  addRequestHeader(headerName: string, headerValue: string): void;

  removeRequestHeader(headerName: string): void;

  setConnected(connected: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNNetworkModule");
