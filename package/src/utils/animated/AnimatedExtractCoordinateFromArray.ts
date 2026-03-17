import { Animated } from "react-native";

import type { AnimatedCoordinates } from "./AbstractAnimatedCoordinates";
import { AnimatedRouteCoordinatesArray } from "./AnimatedRouteCoordinatesArray";

const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

export class AnimatedExtractCoordinateFromArray extends AnimatedWithChildren {
  private array: AnimatedRouteCoordinatesArray;
  private readonly index: number;

  constructor(array: AnimatedRouteCoordinatesArray, index: number) {
    super();
    this.array = array;
    this.index = index;
  }

  __getValue(): AnimatedCoordinates {
    const actArray = this.array.__getValue();
    let index = this.index;

    if (index < 0) {
      index += actArray.length;
    }

    return actArray[index]!;
  }

  __attach(): void {
    this.array.__addChild(this);
  }

  __detach(): void {
    this.array.__removeChild(this);
    super.__detach();
  }
}
