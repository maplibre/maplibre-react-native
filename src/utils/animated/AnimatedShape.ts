/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Animated } from "react-native";

import type { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";

// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Animated/nodes/AnimatedWithChildren.js
const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

if (__DEV__) {
  if (AnimatedWithChildren.name !== "AnimatedWithChildren") {
    console.error(
      "AnimatedShape could not obtain AnimatedWithChildren base class",
    );
  }
}

type Shape =
  | {
      type: "Point";
      coordinates: AnimatedExtractCoordinateFromArray;
    }
  | {
      type: "LineString";
      coordinates: AnimatedCoordinatesArray | AnimatedRouteCoordinatesArray;
    };

/**
 * AnimatedShape can be used to have animated properties inside the shape property
 *
 * Equivalent of AnimatedStyle for shapes
 * https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Animated/nodes/AnimatedStyle.js
 *
 * @example
 * <AnimatedShapeSource ... shape={new AnimatedShape({type:'LineString', coordinates: animatedCoords})} />
 */
export class AnimatedShape extends AnimatedWithChildren {
  constructor(shape: Shape) {
    super();
    this.shape = shape;
  }

  _walkShapeAndGetValues(value: any): any {
    if (Array.isArray(value)) {
      return value.map((i) => this._walkShapeAndGetValues(i));
    }

    // @ts-expect-error Animated.Node is not exported
    if (value instanceof Animated.Node) {
      return (value as any).__getValue();
    }

    if (typeof value === "object") {
      const result: { [key: string]: any } = {};

      for (const key in value) {
        result[key] = this._walkShapeAndGetValues(value[key]);
      }

      return result;
    }

    return value;
  }

  __getValue(): GeoJSON.Point | GeoJSON.LineString {
    const shape = this._walkShapeAndGetValues(this.shape);

    if (shape.type === "LineString" && shape.coordinates.length === 1) {
      shape.coordinates = [...shape.coordinates, ...shape.coordinates];
    }

    return shape;
  }

  // @ts-expect-error Animated.Node is not exported
  _walkAndProcess(value: any, cb: (value: Animated.Node) => void): void {
    if (Array.isArray(value)) {
      value.forEach((i) => this._walkAndProcess(i, cb));
      // @ts-expect-error Animated.Node is not exported
    } else if (value instanceof Animated.Node) {
      cb(value);
    } else if (typeof value === "object") {
      for (const key in value) {
        this._walkAndProcess(value[key], cb);
      }
    }
  }

  __attach(): void {
    this._walkAndProcess(this.shape, (v) => (v as any).__addChild(this));
  }

  __detach(): void {
    this._walkAndProcess(this.shape, (v) => (v as any).__removeChild(this));
    super.__detach();
  }
}
