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
  type TrackUserLocation,
  type TrackUserLocationChangeEvent,
  type CameraRef,
  type CameraProps,
  Camera,
} from "./components/camera/Camera";

export {
  type ViewState,
  type ViewStateChangeEvent,
  type MapRef,
  type MapProps,
  Map,
} from "./components/map/Map";

export {
  ViewAnnotation,
  type ViewAnnotationProps,
  type ViewAnnotationRef,
  type ViewAnnotationEvent,
} from "./components/annotations/view-annotation/ViewAnnotation";

export {
  type LayerAnnotationProps,
  LayerAnnotation,
} from "./components/annotations/LayerAnnotation";

export {
  Callout,
  type CalloutProps,
} from "./components/annotations/callout/Callout";

export { UserLocation } from "./components/user-location/UserLocation";
export { NativeUserLocation } from "./components/user-location/NativeUserLocation";
export { useCurrentPosition } from "./hooks/useCurrentPosition";

export {
  type ImageSourceProps,
  ImageSource,
} from "./components/sources/image-source/ImageSource";

export {
  type GeoJSONSourceRef,
  type GeoJSONSourceProps,
  GeoJSONSource,
} from "./components/sources/geojson-source/GeoJSONSource";

export {
  type RasterSourceProps,
  RasterSource,
} from "./components/sources/raster-source/RasterSource";

export {
  type VectorSourceRef,
  type VectorSourceProps,
  VectorSource,
} from "./components/sources/vector-source/VectorSource";

export {
  Layer,
  type LayerProps,
  type SourceLayerProps,
  type FillLayerProps,
  type LineLayerProps,
  type SymbolLayerProps,
  type CircleLayerProps,
  type HeatmapLayerProps,
  type FillExtrusionLayerProps,
  type RasterLayerProps,
  type BackgroundLayerProps,
} from "./components/layers/Layer";

// Re-export LayerSpecification from style spec for JSON interoperability
export type { LayerSpecification } from "@maplibre/maplibre-gl-style-spec";

export {
  type ImageSourceWithSdf,
  type ImageEntry,
  type ImagesProps,
  Images,
} from "./components/images/Images";

export {
  Marker,
  type MarkerProps,
} from "./components/annotations/marker/Marker";

export {
  LocationManager,
  type GeolocationPosition,
} from "./modules/location/LocationManager";

export { LogManager, type LogLevel } from "./modules/log/LogManager";

export { NetworkManager } from "./modules/network/NetworkManager";

export {
  OfflineManager,
  type OfflinePackCreateOptions,
  type OfflinePackDownloadState,
  type OfflinePackError,
  type OfflinePackProgressListener,
  type OfflinePackErrorListener,
} from "./modules/offline/OfflineManager";
export {
  OfflinePack,
  type OfflinePackStatus,
} from "./modules/offline/OfflinePack";

export {
  StaticMapImageManager,
  type StaticMapOptions,
  type StaticMapCenterOptions,
  type StaticMapBoundsOptions,
  type StaticMapCreateOptions,
} from "./modules/static-map/StaticMapManager";

export type { Anchor } from "./types/Anchor";
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
export type { PressEvent } from "./types/PressEvent";
export type { PressEventWithFeatures } from "./types/PressEventWithFeatures";
export type { ViewPadding } from "./types/ViewPadding";

export { Animated } from "./utils/animated/Animated";

export type { MapLibrePluginProps } from "./plugin/MapLibrePluginProps";
