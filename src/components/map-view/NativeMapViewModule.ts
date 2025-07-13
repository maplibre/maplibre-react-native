import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import type { Double, Int32 } from "react-native/Libraries/Types/CodegenTypes";

export interface Spec extends TurboModule {
  getCenter: (
    reactTag: Int32 | null,
  ) => Promise<[longitude: number, latitude: number]>;

  getZoom: (reactTag: Int32 | null) => Promise<Double>;

  getVisibleBounds: (
    reactTag: Int32 | null,
  ) => Promise<[northEast: [number, number], southWest: [number, number]]>;

  getPointInView: (
    reactTag: Int32 | null,
    coordinate: number[],
  ) => Promise<[x: number, y: number]>;

  getCoordinateFromView: (
    reactTag: Int32 | null,
    point: number[],
  ) => Promise<[longitude: number, latitude: number]>;

  queryRenderedFeaturesAtPoint: (
    reactTag: Int32 | null,
    point: number[],
    layerIds: string[],
    filter: string[],
  ) => Promise<object>;

  queryRenderedFeaturesInRect: (
    reactTag: Int32 | null,
    bbox: number[],
    layerIds: string[],
    filter: string[],
  ) => Promise<object>;

  setSourceVisibility: (
    reactTag: Int32 | null,
    visible: boolean,
    sourceId: string,
    sourceLayerId: string | null,
  ) => Promise<void>;

  setHandledMapChangedEvents: (
    reactTag: Int32 | null,
    events: string[],
  ) => Promise<object>;

  takeSnap: (reactTag: Int32 | null, writeToDisk: boolean) => Promise<string>;

  showAttribution: (reactTag: Int32 | null) => Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNMapViewModule");
