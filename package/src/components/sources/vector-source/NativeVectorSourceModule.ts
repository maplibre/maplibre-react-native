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
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNVectorSourceModule");
