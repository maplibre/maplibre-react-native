import {
  type CodegenTypes,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";

type NativeViewState = {
  center: CodegenTypes.Double[];
  zoom: CodegenTypes.Double;
  bearing: CodegenTypes.Double;
  pitch: CodegenTypes.Double;
  bounds: CodegenTypes.Double[];
};

export interface Spec extends TurboModule {
  getCenter: (
    reactTag: CodegenTypes.Int32,
  ) => Promise<[longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]>;

  getZoom: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getBearing: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getPitch: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getBounds: (
    reactTag: CodegenTypes.Int32,
  ) => Promise<
    [
      west: CodegenTypes.Double,
      south: CodegenTypes.Double,
      east: CodegenTypes.Double,
      north: CodegenTypes.Double,
    ]
  >;

  getViewState: (reactTag: CodegenTypes.Int32) => Promise<NativeViewState>;

  project: (
    reactTag: CodegenTypes.Int32,
    lngLat: CodegenTypes.Double[],
  ) => Promise<[x: CodegenTypes.Double, y: CodegenTypes.Double]>;

  unproject: (
    reactTag: CodegenTypes.Int32,
    pixelPoint: CodegenTypes.Double[],
  ) => Promise<[longitude: CodegenTypes.Double, latitude: CodegenTypes.Double]>;

  queryRenderedFeaturesWithPoint: (
    reactTag: CodegenTypes.Int32,
    pixelPoint: CodegenTypes.Double[],
    layers: string[],
    filter: string[],
  ) => Promise<GeoJSON.Feature[]>;

  queryRenderedFeaturesWithBounds: (
    reactTag: CodegenTypes.Int32,
    pixelPointBounds: CodegenTypes.Double[][] | null,
    layers: string[],
    filter: string[],
  ) => Promise<GeoJSON.Feature[]>;

  setSourceVisibility: (
    reactTag: CodegenTypes.Int32,
    visible: boolean,
    sourceId: string,
    sourceLayerId: string | null,
  ) => Promise<void>;

  createStaticMapImage: (
    reactTag: CodegenTypes.Int32,
    output: "base64" | "file",
  ) => Promise<string>;

  showAttribution: (reactTag: CodegenTypes.Int32) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNMapViewModule");
