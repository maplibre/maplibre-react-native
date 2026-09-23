import {
  type CodegenTypes,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";

export interface Spec extends TurboModule {
  getData: (
    reactTag: CodegenTypes.Int32,
    filter?: any[],
  ) => Promise<GeoJSON.FeatureCollection>;

  getClusterExpansionZoom: (
    reactTag: CodegenTypes.Int32,
    clusterId: CodegenTypes.Int32,
  ) => Promise<number>;

  getClusterLeaves: (
    reactTag: CodegenTypes.Int32,
    clusterId: CodegenTypes.Int32,
    limit: CodegenTypes.Int32,
    offset: CodegenTypes.Int32,
  ) => Promise<GeoJSON.Feature[]>;

  getClusterChildren: (
    reactTag: CodegenTypes.Int32,
    clusterId: CodegenTypes.Int32,
  ) => Promise<GeoJSON.Feature[]>;

  setFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string,
    state: CodegenTypes.UnsafeObject,
  ) => Promise<void>;

  getFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string,
  ) => Promise<CodegenTypes.UnsafeObject | null>;

  removeFeatureState: (
    reactTag: CodegenTypes.Int32,
    featureId: string | null,
    key: string | null,
  ) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  "MLRNGeoJSONSourceModule",
);
