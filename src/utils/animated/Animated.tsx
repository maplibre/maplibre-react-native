import type { ComponentProps, ComponentType } from "react";
import { Animated as RNAnimated } from "react-native";

import { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedGeoJSON } from "./AnimatedGeoJSON";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";
import {
  Layer,
  type BackgroundLayerProps,
  type CircleLayerProps,
  type FillExtrusionLayerProps,
  type FillLayerProps,
  type HeatmapLayerProps,
  type LineLayerProps,
  type RasterLayerProps,
  type SymbolLayerProps,
} from "../../components/layers/Layer";
import { GeoJSONSource } from "../../components/sources/geojson-source/GeoJSONSource";
import { ImageSource } from "../../components/sources/image-source/ImageSource";

// Create typed layer wrapper components for animation support
const FillLayer = (props: Omit<FillLayerProps, "type">) => (
  <Layer type="fill" {...props} />
);
const FillExtrusionLayer = (props: Omit<FillExtrusionLayerProps, "type">) => (
  <Layer type="fill-extrusion" {...props} />
);
const LineLayer = (props: Omit<LineLayerProps, "type">) => (
  <Layer type="line" {...props} />
);
const CircleLayer = (props: Omit<CircleLayerProps, "type">) => (
  <Layer type="circle" {...props} />
);
const SymbolLayer = (props: Omit<SymbolLayerProps, "type">) => (
  <Layer type="symbol" {...props} />
);
const HeatmapLayer = (props: Omit<HeatmapLayerProps, "type">) => (
  <Layer type="heatmap" {...props} />
);
const RasterLayer = (props: Omit<RasterLayerProps, "type">) => (
  <Layer type="raster" {...props} />
);
const BackgroundLayer = (props: Omit<BackgroundLayerProps, "type">) => (
  <Layer type="background" {...props} />
);

export const Animated = {
  // Sources
  GeoJSONSource: RNAnimated.createAnimatedComponent(
    GeoJSONSource as unknown as ComponentType<
      Omit<ComponentProps<typeof GeoJSONSource>, "data"> & {
        data: string | GeoJSON.GeoJSON | AnimatedGeoJSON;
      }
    >,
  ),
  ImageSource: RNAnimated.createAnimatedComponent(ImageSource),

  // Layers
  FillLayer: RNAnimated.createAnimatedComponent(FillLayer),
  FillExtrusionLayer: RNAnimated.createAnimatedComponent(FillExtrusionLayer),
  LineLayer: RNAnimated.createAnimatedComponent(LineLayer),
  CircleLayer: RNAnimated.createAnimatedComponent(CircleLayer),
  SymbolLayer: RNAnimated.createAnimatedComponent(SymbolLayer),
  HeatmapLayer: RNAnimated.createAnimatedComponent(HeatmapLayer),
  RasterLayer: RNAnimated.createAnimatedComponent(RasterLayer),
  BackgroundLayer: RNAnimated.createAnimatedComponent(BackgroundLayer),

  // Values
  CoordinatesArray: AnimatedCoordinatesArray,
  RouteCoordinatesArray: AnimatedRouteCoordinatesArray,
  GeoJSON: AnimatedGeoJSON,
  ExtractCoordinateFromArray: AnimatedExtractCoordinateFromArray,
};
