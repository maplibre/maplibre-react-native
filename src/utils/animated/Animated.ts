import type { ComponentProps, ComponentType } from "react";
import { Animated as RNAnimated } from "react-native";

import { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";
import { AnimatedShape } from "./AnimatedShape";
import { BackgroundLayer } from "../../components/layers/BackgroundLayer";
import { CircleLayer } from "../../components/layers/CircleLayer";
import { FillExtrusionLayer } from "../../components/layers/FillExtrusionLayer";
import { FillLayer } from "../../components/layers/FillLayer";
import { LineLayer } from "../../components/layers/LineLayer";
import { RasterLayer } from "../../components/layers/RasterLayer";
import { SymbolLayer } from "../../components/layers/SymbolLayer";
import { ImageSource } from "../../components/sources/image-source/ImageSource";
import { ShapeSource } from "../../components/sources/shape-source/ShapeSource";

export const Animated = {
  // Sources
  ShapeSource: RNAnimated.createAnimatedComponent(
    ShapeSource as unknown as ComponentType<
      Omit<ComponentProps<typeof ShapeSource>, "data"> & {
        data: string | GeoJSON.GeoJSON | AnimatedShape;
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
  RasterLayer: RNAnimated.createAnimatedComponent(RasterLayer),
  BackgroundLayer: RNAnimated.createAnimatedComponent(BackgroundLayer),

  // Values
  CoordinatesArray: AnimatedCoordinatesArray,
  RouteCoordinatesArray: AnimatedRouteCoordinatesArray,
  Shape: AnimatedShape,
  ExtractCoordinateFromArray: AnimatedExtractCoordinateFromArray,
};
