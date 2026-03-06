import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  addRequestHeader(name: string, value: string, match: string | null): void;

  removeRequestHeader(name: string): void;

  setConnected(connected: boolean): void;

  addUrlParam(key: string, value: string, match: string | null): void;

  removeUrlParam(key: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNNetworkModule");
