export * from "./MLRNModule";
export {
  Camera,
  UserTrackingMode,
  type CameraPadding,
  type CameraAnimationMode,
  type CameraBounds,
  type CameraRef,
} from "./components/Camera";
export {
  MapView,
  type MapViewRef,
  type RegionPayload,
} from "./components/MapView";
export { Light } from "./components/Light";
export { PointAnnotation } from "./components/PointAnnotation";
export type { PointAnnotationRef } from "./components/PointAnnotation";
export { Annotation } from "./components/Annotation";
export { Callout } from "./components/Callout";
export { requestAndroidLocationPermissions } from "./requestAndroidLocationPermissions";
export {
  UserLocation,
  UserLocationRenderMode,
} from "./components/UserLocation";
export type { UserLocationRef } from "./components/UserLocation";
export { VectorSource } from "./components/VectorSource";
export { ShapeSource } from "./components/ShapeSource";
export type { ShapeSourceRef } from "./components/ShapeSource";
export { RasterSource } from "./components/RasterSource";
export { ImageSource } from "./components/ImageSource";
export { Images } from "./components/Images";
export { FillLayer } from "./components/FillLayer";
export { FillExtrusionLayer } from "./components/FillExtrusionLayer";
export { HeatmapLayer } from "./components/HeatmapLayer";
export { LineLayer } from "./components/LineLayer";
export { CircleLayer } from "./components/CircleLayer";
export { SymbolLayer } from "./components/SymbolLayer";
export { RasterLayer } from "./components/RasterLayer";
export { BackgroundLayer } from "./components/BackgroundLayer";
export { MarkerView } from "./components/MarkerView";

export {
  LocationManager,
  /**
   * @deprecated Use LocationManager instead
   */
  LocationManager as locationManager,
  type Location,
} from "./modules/location/LocationManager";
export {
  OfflineManager,
  /**
   * @deprecated Use OfflineManager instead
   */
  OfflineManager as offlineManager,
} from "./modules/offline/OfflineManager";
export type { OfflinePackError } from "./modules/offline/OfflineManager";
export type { OfflinePackStatus } from "./modules/offline/OfflinePack";
export { OfflinePack } from "./modules/offline/OfflinePack";
export { OfflineCreatePackOptions } from "./modules/offline/OfflineCreatePackOptions";
export {
  SnapshotManager,
  /**
   * @deprecated Use SnapshotManager instead
   */
  SnapshotManager as snapshotManager,
} from "./modules/snapshot/SnapshotManager";
export type { SnapshotInputOptions } from "./modules/snapshot/SnapshotOptions";

export type { MapLibreRNEvent } from "./types/MapLibreRNEvent";

export { Animated } from "./utils/animated/Animated";
export { Logger, type LogLevel } from "./utils/Logger";
export type {
  FillLayerStyle,
  LineLayerStyle,
  SymbolLayerStyle,
  CircleLayerStyle,
  HeatmapLayerStyle,
  FillExtrusionLayerStyle,
  RasterLayerStyle,
  HillshadeLayerStyle,
  BackgroundLayerStyle,
  LightLayerStyle,
} from "./types/MapLibreRNStyles";

export type { MapLibrePluginProps } from "./plugin/MapLibrePluginProps";
