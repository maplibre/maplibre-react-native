import { Animated } from "react-native";

// see
// https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/nodes/AnimatedWithChildren.js
const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);
if (__DEV__) {
  if (AnimatedWithChildren.name !== "AnimatedWithChildren") {
    console.error(
      "AnimatedCoordinatesArray could not obtain AnimatedWithChildren base class",
    );
  }
}

export class AnimatedExtractCoordinateFromArray extends AnimatedWithChildren {
  _array: AnimatedExtractCoordinateFromArray;

  _index = 0;

  constructor(array: AnimatedExtractCoordinateFromArray, index: number) {
    super();
    this._array = array;
    this._index = index;
  }

  __getValue(): AnimatedExtractCoordinateFromArray {
    const actArray = this._array.__getValue();
    let index = this._index;

    if (index < 0) {
      index += actArray.length;
    }
    return actArray[index];
  }

  __attach(): void {
    this._array.__addChild(this);
  }

  __detach(): void {
    this._array.__removeChild(this);
    super.__detach();
  }
}
