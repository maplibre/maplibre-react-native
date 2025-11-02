import {
  type CodegenTypes,
  type TurboModule,
  TurboModuleRegistry,
} from "react-native";

type NativeViewState = {
  longitude: CodegenTypes.Double;
  latitude: CodegenTypes.Double;
  zoom: CodegenTypes.Double;
  bearing: CodegenTypes.Double;
  pitch: CodegenTypes.Double;
  bounds: CodegenTypes.Double[];
};

export interface Spec extends TurboModule {
  getCenter: (reactTag: CodegenTypes.Int32) => Promise<{
    longitude: CodegenTypes.Double;
    latitude: CodegenTypes.Double;
  }>;

  getZoom: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getBearing: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getPitch: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double>;

  getBounds: (reactTag: CodegenTypes.Int32) => Promise<CodegenTypes.Double[]>;

  getViewState: (reactTag: CodegenTypes.Int32) => Promise<NativeViewState>;

  project: (
    reactTag: CodegenTypes.Int32,
    coordinate: {
      longitude: CodegenTypes.Double;
      latitude: CodegenTypes.Double;
    },
  ) => Promise<{
    locationX: CodegenTypes.Double;
    locationY: CodegenTypes.Double;
  }>;

  unproject: (
    reactTag: CodegenTypes.Int32,
    point: { locationX: CodegenTypes.Double; locationY: CodegenTypes.Double },
  ) => Promise<{
    longitude: CodegenTypes.Double;
    latitude: CodegenTypes.Double;
  }>;

  queryRenderedFeaturesWithCoordinate: (
    reactTag: CodegenTypes.Int32,
    coordinate: {
      longitude: CodegenTypes.Double;
      latitude: CodegenTypes.Double;
    },
    layers: string[],
    filter: string[],
  ) => Promise<object>;

  queryRenderedFeaturesWithBounds: (
    reactTag: CodegenTypes.Int32,
    bounds: CodegenTypes.Double[],
    layers: string[],
    filter: string[],
  ) => Promise<object>;

  setSourceVisibility: (
    reactTag: CodegenTypes.Int32,
    visible: boolean,
    sourceId: string,
    sourceLayerId: string | null,
  ) => Promise<void>;

  takeSnap: (
    reactTag: CodegenTypes.Int32,
    writeToDisk: boolean,
  ) => Promise<string>;

  showAttribution: (reactTag: CodegenTypes.Int32) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNMapViewModule");
