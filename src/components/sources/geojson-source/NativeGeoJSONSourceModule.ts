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
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  "MLRNGeoJSONSourceModule",
);
