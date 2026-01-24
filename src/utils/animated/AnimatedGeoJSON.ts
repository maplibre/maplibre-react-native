import { Animated } from "react-native";

import type { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";

const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

type AnimatableGeoJSON =
  | {
      type: "Point";
      coordinates: AnimatedExtractCoordinateFromArray;
    }
  | {
      type: "LineString";
      coordinates: AnimatedCoordinatesArray | AnimatedRouteCoordinatesArray;
    };

/**
 * AnimatedGeoJSON can be used to have animated properties inside the data property
 *
 * Equivalent of AnimatedStyle for GeoJSON
 * https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Animated/nodes/AnimatedStyle.js
 *
 * @example
 * <AnimatedGeoJSONSource ... data={new AnimatedGeoJSON({type:'LineString', coordinates: animatedCoords})} />
 */
export class AnimatedGeoJSON extends AnimatedWithChildren {
  constructor(geojson: AnimatableGeoJSON) {
    super();
    this.geojson = geojson;
  }

  _walkGeoJSONAndGetValues(value: any): any {
    if (Array.isArray(value)) {
      return value.map((i) => this._walkGeoJSONAndGetValues(i));
    }

    if (value instanceof AnimatedWithChildren) {
      return (value as any).__getValue();
    }

    if (typeof value === "object") {
      const result: { [key: string]: any } = {};

      for (const key in value) {
        result[key] = this._walkGeoJSONAndGetValues(value[key]);
      }

      return result;
    }

    return value;
  }

  __getValue(): GeoJSON.Point | GeoJSON.LineString {
    const geojson = this._walkGeoJSONAndGetValues(this.geojson);

    if (geojson.type === "LineString" && geojson.coordinates.length === 1) {
      geojson.coordinates = [...geojson.coordinates, ...geojson.coordinates];
    }

    return geojson;
  }

  _walkAndProcess(
    value: any,
    cb: (value: Animated.AnimatedNode) => void,
  ): void {
    if (Array.isArray(value)) {
      value.forEach((i) => this._walkAndProcess(i, cb));
    } else if (value instanceof AnimatedWithChildren) {
      cb(value);
    } else if (typeof value === "object") {
      for (const key in value) {
        this._walkAndProcess(value[key], cb);
      }
    }
  }

  __attach(): void {
    this._walkAndProcess(this.geojson, (v) => (v as any).__addChild(this));
  }

  __detach(): void {
    this._walkAndProcess(this.geojson, (v) => (v as any).__removeChild(this));
    super.__detach();
  }
}
