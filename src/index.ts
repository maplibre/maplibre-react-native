export * from "./MLRNModule";

export {
  type CameraOptions,
  type CameraEasing,
  type CameraAnimationOptions,
  type CameraCenterOptions,
  type CameraBoundsOptions,
  type CameraCenterStop,
  type CameraBoundsStop,
  type CameraStop,
  type InitialViewState,
  type CameraRef,
  type TrackUserLocation,
  type TrackUserLocationChangeEvent,
  type CameraProps,
  Camera,
} from "./components/camera/Camera";

export {
  MapView,
  type MapViewRef,
  type ViewState,
  type ViewStateChangeEvent,
} from "./components/map-view/MapView";

export { PointAnnotation } from "./components/annotations/PointAnnotation";
export type { PointAnnotationRef } from "./components/annotations/PointAnnotation";
export { Annotation } from "./components/annotations/Annotation";
export { Callout } from "./components/annotations/Callout";

export { UserLocation } from "./components/user-location/UserLocation";
export { NativeUserLocation } from "./components/user-location/NativeUserLocation";
export { useUserLocation } from "./hooks/useUserLocation";

export { VectorSource } from "./components/sources/VectorSource";
export { ShapeSource } from "./components/sources/ShapeSource";
export type { ShapeSourceRef } from "./components/sources/ShapeSource";
export { RasterSource } from "./components/sources/RasterSource";
export { ImageSource } from "./components/sources/ImageSource";
export { Images } from "./components/Images";
export { FillLayer } from "./components/layers/FillLayer";
export { FillExtrusionLayer } from "./components/layers/FillExtrusionLayer";
export { HeatmapLayer } from "./components/layers/HeatmapLayer";
export { LineLayer } from "./components/layers/LineLayer";
export { CircleLayer } from "./components/layers/CircleLayer";
export { SymbolLayer } from "./components/layers/SymbolLayer";
export { RasterLayer } from "./components/layers/RasterLayer";
export { BackgroundLayer } from "./components/layers/BackgroundLayer";
export { MarkerView } from "./components/annotations/MarkerView";

export {
  LocationManager,
  type GeolocationPosition,
} from "./modules/location/LocationManager";
export { requestAndroidLocationPermissions } from "./modules/location/requestAndroidLocationPermissions";

export { OfflineManager } from "./modules/offline/OfflineManager";
export type { OfflinePackError } from "./modules/offline/OfflineManager";
export type { OfflinePackStatus } from "./modules/offline/OfflinePack";
export { OfflinePack } from "./modules/offline/OfflinePack";
export { OfflineCreatePackOptions } from "./modules/offline/OfflineCreatePackOptions";
export { SnapshotManager } from "./modules/snapshot/SnapshotManager";
export type { SnapshotInputOptions } from "./modules/snapshot/SnapshotOptions";

export type { Bounds } from "./types/Bounds";
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
  Expression,
} from "./types/MapLibreRNStyles";
export type { PressEvent, PressEventWithFeatures } from "./types/PressEvent";
export type { ViewPadding } from "./types/ViewPadding";

export { Animated } from "./utils/animated/Animated";
export { Logger, type LogLevel } from "./modules/Logger";

export type { MapLibrePluginProps } from "./plugin/MapLibrePluginProps";
