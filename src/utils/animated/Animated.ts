import {
  type ForwardRefExoticComponent,
  type MemoExoticComponent,
  type RefAttributes,
} from "react";
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
import { ImageSource } from "../../components/sources/ImageSource";
import {
  ShapeSource,
  type ShapeSourceProps,
  type ShapeSourceRef,
} from "../../components/sources/ShapeSource";

export const Animated = {
  // sources
  ShapeSource: RNAnimated.createAnimatedComponent(ShapeSource),
  ImageSource: RNAnimated.createAnimatedComponent(ImageSource),

  // layers
  FillLayer: RNAnimated.createAnimatedComponent(FillLayer),
  FillExtrusionLayer: RNAnimated.createAnimatedComponent(FillExtrusionLayer),
  LineLayer: RNAnimated.createAnimatedComponent(LineLayer),
  CircleLayer: RNAnimated.createAnimatedComponent(CircleLayer),
  SymbolLayer: RNAnimated.createAnimatedComponent(SymbolLayer),
  RasterLayer: RNAnimated.createAnimatedComponent(RasterLayer),
  BackgroundLayer: RNAnimated.createAnimatedComponent(BackgroundLayer),

  // values
  CoordinatesArray: AnimatedCoordinatesArray,
  RouteCoordinatesArray: AnimatedRouteCoordinatesArray,
  Shape: AnimatedShape,
  ExtractCoordinateFromArray: AnimatedExtractCoordinateFromArray,
};

type ShapeSourcePropsWithRef = ShapeSourceProps & RefAttributes<ShapeSourceRef>;

type BaseShapeSourceComponent =
  ForwardRefExoticComponent<ShapeSourcePropsWithRef>;

type AnimatedShapeSourceType =
  RNAnimated.AnimatedComponent<BaseShapeSourceComponent> &
    MemoExoticComponent<BaseShapeSourceComponent>;

/**
 * Manual typing is required for AnimatedShapeSource because the
 * following error:
 * `Type instantiation is excessively deep and possibly infinite.ts(2589)`
 */
export const AnimatedShapeSource = RNAnimated.createAnimatedComponent(
  ShapeSource,
) as AnimatedShapeSourceType;
