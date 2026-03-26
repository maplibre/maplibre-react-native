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

  addUrlSearchParam(
    id: string,
    match: string | null,
    name: string,
    value: string,
  ): void;

  removeUrlSearchParam(id: string): void;

  addHeader(
    id: string,
    match: string | null,
    name: string,
    value: string,
  ): void;

  removeHeader(id: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  "MLRNTransformRequestModule",
);
