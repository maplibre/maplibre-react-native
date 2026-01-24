import type { ComponentProps, ComponentType } from "react";
import { Animated as RNAnimated } from "react-native";

import { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedGeoJSON } from "./AnimatedGeoJSON";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";
import { BackgroundLayer } from "../../components/layers/BackgroundLayer";
import { CircleLayer } from "../../components/layers/CircleLayer";
import { FillExtrusionLayer } from "../../components/layers/FillExtrusionLayer";
import { FillLayer } from "../../components/layers/FillLayer";
import { LineLayer } from "../../components/layers/LineLayer";
import { RasterLayer } from "../../components/layers/RasterLayer";
import { SymbolLayer } from "../../components/layers/SymbolLayer";
import { MarkerView } from "../../components/annotations/MarkerView";
import { GeoJSONSource } from "../../components/sources/geojson-source/GeoJSONSource";
import { ImageSource } from "../../components/sources/image-source/ImageSource";

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

  // Annotations
  MarkerView: RNAnimated.createAnimatedComponent(MarkerView),

  // Layers
  FillLayer: RNAnimated.createAnimatedComponent(FillLayer),
  FillExtrusionLayer: RNAnimated.createAnimatedComponent(FillExtrusionLayer),
  LineLayer: RNAnimated.createAnimatedComponent(LineLayer),
  CircleLayer: RNAnimated.createAnimatedComponent(CircleLayer),
  SymbolLayer: RNAnimated.createAnimatedComponent(SymbolLayer),
  RasterLayer: RNAnimated.createAnimatedComponent(RasterLayer),
  BackgroundLayer: RNAnimated.createAnimatedComponent(BackgroundLayer),

  // Values
  CoordinatesArray: AnimatedCoordinatesArray,
  RouteCoordinatesArray: AnimatedRouteCoordinatesArray,
  GeoJSON: AnimatedGeoJSON,
  ExtractCoordinateFromArray: AnimatedExtractCoordinateFromArray,
};
