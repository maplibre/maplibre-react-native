import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import type { Double, Int32 } from "react-native/Libraries/Types/CodegenTypes";

type NativeViewState = {
  longitude: Double;
  latitude: Double;
  zoom: Double;
  bearing: Double;
  pitch: Double;
  bounds: Double[];
};

export interface Spec extends TurboModule {
  getCenter: (
    reactTag: Int32,
  ) => Promise<{ longitude: Double; latitude: Double }>;

  getZoom: (reactTag: Int32) => Promise<Double>;

  getBearing: (reactTag: Int32) => Promise<Double>;

  getPitch: (reactTag: Int32) => Promise<Double>;

  getBounds: (reactTag: Int32) => Promise<Double[]>;

  getViewState: (reactTag: Int32) => Promise<NativeViewState>;

  project: (
    reactTag: Int32,
    coordinate: { longitude: Double; latitude: Double },
  ) => Promise<{ locationX: Double; locationY: Double }>;

  unproject: (
    reactTag: Int32,
    point: { locationX: Double; locationY: Double },
  ) => Promise<{ longitude: Double; latitude: Double }>;

  queryRenderedFeaturesWithCoordinate: (
    reactTag: Int32,
    coordinate: { longitude: Double; latitude: Double },
    layers: string[],
    filter: string[],
  ) => Promise<object>;

  queryRenderedFeaturesWithBounds: (
    reactTag: Int32,
    bounds: Double[],
    layers: string[],
    filter: string[],
  ) => Promise<object>;

  setSourceVisibility: (
    reactTag: Int32,
    visible: boolean,
    sourceId: string,
    sourceLayerId: string | null,
  ) => Promise<void>;

  takeSnap: (reactTag: Int32, writeToDisk: boolean) => Promise<string>;

  showAttribution: (reactTag: Int32) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNMapViewModule");
