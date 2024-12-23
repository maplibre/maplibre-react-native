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
import { BackgroundLayer } from "../../components/BackgroundLayer";
import { CircleLayer } from "../../components/CircleLayer";
import { FillExtrusionLayer } from "../../components/FillExtrusionLayer";
import { FillLayer } from "../../components/FillLayer";
import { ImageSource } from "../../components/ImageSource";
import { LineLayer } from "../../components/LineLayer";
import { RasterLayer } from "../../components/RasterLayer";
import {
  ShapeSource,
  type ShapeSourceProps,
  type ShapeSourceRef,
} from "../../components/ShapeSource";
import { SymbolLayer } from "../../components/SymbolLayer";

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
