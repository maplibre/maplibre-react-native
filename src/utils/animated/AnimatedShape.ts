/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Animated } from "react-native";

import { AnimatedCoordinatesArray } from "./AnimatedCoordinatesArray";
import { AnimatedExtractCoordinateFromArray } from "./AnimatedExtractCoordinateFromArray";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";

// see
// https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/nodes/AnimatedWithChildren.js
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
      coordinates:
        | AnimatedExtractCoordinateFromArray
        | AnimatedRouteCoordinatesArray;
    }
  | {
      type: "LineString";
      coordinates: AnimatedCoordinatesArray;
    };

/**
 * AnimatedShape can be used to have animated properties inside the shape property
 * @example
 * <AnimatedShapeSource ... shape={new AnimatedShape({type:'LineString', coordinates: animatedCoords})} />
 */
export class AnimatedShape extends AnimatedWithChildren {
  // equivalent of AnimatedStyle for shapes
  // https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/nodes/AnimatedStyle.js

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

  __getValue(): any {
    const result = this._walkShapeAndGetValues(this.shape);
    return result;
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
