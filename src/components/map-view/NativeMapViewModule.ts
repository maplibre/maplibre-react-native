import { TurboModuleRegistry } from "react-native";
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import type { Double, Int32 } from "react-native/Libraries/Types/CodegenTypes";

export interface Spec extends TurboModule {
  getCenter: (
    reactTag: Int32 | null,
  ) => Promise<[longitude: number, latitude: number]>;

  getZoom: (reactTag: Int32 | null) => Promise<Double>;

  getVisibleBounds: (reactTag: Int32 | null) => Promise<object>;

  getPointInView: (
    reactTag: Int32 | null,
    atCoordinate: number[],
  ) => Promise<[x: number, y: number]>;

  getCoordinateFromView: (
    reactTag: Int32 | null,
    atPoint: number[],
  ) => Promise<[longitude: number, latitude: number]>;

  queryTerrainElevation: (
    reactTag: Int32 | null,
    coordinates: readonly number[],
  ) => Promise<object>;

  queryRenderedFeaturesAtPoint: (
    reactTag: Int32 | null,
    atPoint: readonly number[],
    withFilter: readonly object[],
    withLayerIDs: readonly string[],
  ) => Promise<object>;

  queryRenderedFeaturesInRect: (
    reactTag: Int32 | null,
    withBBox: readonly number[],
    withFilter: readonly object[],
    withLayerIDs: readonly string[],
  ) => Promise<object>;

  querySourceFeatures: (
    reactTag: Int32 | null,
    sourceId: string,
    withFilter: readonly object[],
    withSourceLayerIDs: readonly string[],
  ) => Promise<object>;

  setSourceVisibility: (
    reactTag: Int32 | null,
    visible: boolean,
    sourceId: string,
    sourceLayerId: string,
  ) => Promise<object>;

  setHandledMapChangedEvents: (
    reactTag: Int32 | null,
    events: readonly string[],
  ) => Promise<object>;

  takeSnap: (reactTag: Int32 | null, writeToDisk: boolean) => Promise<string>;

  clearData: (reactTag: Int32 | null) => Promise<object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNMapViewModule");
