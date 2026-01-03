import { Animated } from "react-native";

import type { AnimatedCoordinates } from "./AbstractAnimatedCoordinates";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";

const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

export class AnimatedExtractCoordinateFromArray extends AnimatedWithChildren {
  _array: AnimatedRouteCoordinatesArray;

  _index = 0;

  constructor(array: AnimatedRouteCoordinatesArray, index: number) {
    super();
    this._array = array;
    this._index = index;
  }

  __getValue(): AnimatedCoordinates {
    const actArray = this._array.__getValue();
    let index = this._index;

    if (index < 0) {
      index += actArray.length;
    }

    return actArray[index]!;
  }

  __attach(): void {
    this._array.__addChild(this);
  }

  __detach(): void {
    this._array.__removeChild(this);
    super.__detach();
  }
}
