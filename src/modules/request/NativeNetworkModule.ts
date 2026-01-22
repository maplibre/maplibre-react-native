import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  addRequestHeader(name: string, value: string, match: string | null): void;

  removeRequestHeader(name: string): void;

  setConnected(connected: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNNetworkModule");
