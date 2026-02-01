import type { ComponentProps, ComponentType } from "react";
import { Animated as RNAnimated } from "react-native";

import { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedGeoJSON } from "./AnimatedGeoJSON";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";
import { MarkerView } from "../../components/annotations/MarkerView";
import { Layer } from "../../components/layers/Layer";
import { GeoJSONSource } from "../../components/sources/geojson-source/GeoJSONSource";
import { ImageSource } from "../../components/sources/image-source/ImageSource";

export const Animated = {
  // Components

  GeoJSONSource: RNAnimated.createAnimatedComponent(
    GeoJSONSource as unknown as ComponentType<
      Omit<ComponentProps<typeof GeoJSONSource>, "data"> & {
        data: string | GeoJSON.GeoJSON | AnimatedGeoJSON;
      }
    >,
  ),
  ImageSource: RNAnimated.createAnimatedComponent(ImageSource),

  MarkerView: RNAnimated.createAnimatedComponent(MarkerView),

  Layer: RNAnimated.createAnimatedComponent(Layer),

  // Values

  CoordinatesArray: AnimatedCoordinatesArray,
  RouteCoordinatesArray: AnimatedRouteCoordinatesArray,
  GeoJSON: AnimatedGeoJSON,
  ExtractCoordinateFromArray: AnimatedExtractCoordinateFromArray,
};
