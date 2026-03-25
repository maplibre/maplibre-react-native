import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  addUrlTransform(
    id: string,
    match: string | null,
    find: string,
    replace: string,
  ): void;

  removeUrlTransform(id: string): void;

  clearUrlTransforms(): void;

  addUrlSearchParam(name: string, value: string, match: string | null): void;

  removeUrlSearchParam(name: string): void;

  addHeader(name: string, value: string, match: string | null): void;

  removeHeader(name: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  "MLRNTransformRequestModule",
);
