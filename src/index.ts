// Constants
export {
  StyleURL,
  StyleSource,
  OfflinePackDownloadState,
  type OfflinePackDownloadStateType,
} from "./constants";

// Request module (custom headers, connectivity)
export { RequestManager } from "./modules/request/RequestManager";

export {
  Camera,
  type CameraProps,
  type CameraRef,
  type CameraOptions,
  type CameraEasing,
  type CameraAnimationOptions,
  type CameraCenterOptions,
  type CameraBoundsOptions,
  type CameraCenterStop,
  type CameraBoundsStop,
  type CameraStop,
  type InitialViewState,
  type TrackUserLocation,
  type TrackUserLocationChangeEvent,
} from "./components/camera/Camera";

export {
  MapView,
  type MapViewProps,
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
export { useCurrentPosition } from "./hooks/useCurrentPosition";

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

export { OfflineManager } from "./modules/offline/OfflineManager";
export type { OfflinePackError } from "./modules/offline/OfflineManager";
export type { OfflinePackStatus } from "./modules/offline/OfflinePack";
export { OfflinePack } from "./modules/offline/OfflinePack";
export { OfflineCreatePackOptions } from "./modules/offline/OfflineCreatePackOptions";
export { SnapshotManager } from "./modules/snapshot/SnapshotManager";
export type { SnapshotInputOptions } from "./modules/snapshot/SnapshotOptions";

export type { LngLat } from "./types/LngLat";
export type { LngLatBounds } from "./types/LngLatBounds";
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
export type { PixelPoint } from "./types/PixelPoint";
export type { PixelPointBounds } from "./types/PixelPointBounds";
export type { PressEvent, PressEventWithFeatures } from "./types/PressEvent";
export type { ViewPadding } from "./types/ViewPadding";

export { Animated } from "./utils/animated/Animated";
export { LogManager, type LogLevel } from "./modules/log/LogManager";

export type { MapLibrePluginProps } from "./plugin/MapLibrePluginProps";
