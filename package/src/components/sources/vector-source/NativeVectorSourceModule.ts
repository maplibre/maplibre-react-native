import {
  type CodegenTypes,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";

export interface Spec extends TurboModule {
  querySourceFeatures: (
    reactTag: CodegenTypes.Int32,
    sourceLayer: string,
    filter: string[],
  ) => Promise<GeoJSON.Feature[]>;

  setFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string,
    sourceLayer: string,
    state: CodegenTypes.UnsafeObject,
  ) => Promise<void>;

  getFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string,
    sourceLayer: string,
  ) => Promise<CodegenTypes.UnsafeObject | null>;

  removeFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string | null,
    sourceLayer: string,
    key: string | null,
  ) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNVectorSourceModule");
