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
    sourceLayer: string,
    featureId: string,
    state: CodegenTypes.UnsafeObject,
  ) => Promise<void>;

  getFeatureState: (
    reactTag: CodegenTypes.Int32,
    sourceLayer: string,
    featureId: string,
  ) => Promise<CodegenTypes.UnsafeObject | null>;

  removeFeatureState: (
    reactTag: CodegenTypes.Int32,
    sourceLayer: string,
    featureId: string | null,
    key: string | null,
  ) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNVectorSourceModule");
