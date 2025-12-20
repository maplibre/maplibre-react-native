import FakeTimers from "@sinonjs/fake-timers";
import { act } from "@testing-library/react-native";
import React, { createRef } from "react";
import { Animated, Easing } from "react-native";
import { create } from "react-test-renderer";

import { ShapeSource } from "../../..";
import { AnimatedCoordinatesArray } from "../../../utils/animated/AnimatedCoordinatesArray";
import { AnimatedShape } from "../../../utils/animated/AnimatedShape";

let clock = null;
let oldNodeEnv = null;

beforeAll(() => {
  clock = FakeTimers.install();
  clock._requestedAnimationFrames = [];
  clock.requestAnimationFrame = (callback) => {
    clock._requestedAnimationFrames.push(callback);
  };

  clock.fireRequestAnimationFrames = () => {
    const oldRAF = clock._requestedAnimationFrames;
    clock._requestedAnimationFrames = [];
    oldRAF.forEach((cb) => cb(Date.now()));
  };

  // animated will not call nativeProps in test mode
  // https://github.com/facebook/react-native/blob/34d3373bb0f7ee405292bf993163f29759ba5205/Libraries/Animated/createAnimatedComponent.js#L150-L156
  oldNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "dev";
});

afterAll(() => {
  process.env.NODE_ENV = oldNodeEnv;
  clock.uninstall();
});

const AnimatedShapeSource = Animated.createAnimatedComponent(ShapeSource);

describe("AnimatedShapeSource", () => {
  test("testSetNativeProps", () => {
    AnimatedShapeSource.__skipSetNativeProps_FOR_TESTS_ONLY = false;
    const coordinates = new AnimatedCoordinatesArray([
      [1, 1],
      [10, 10],
    ]);

    const shapeSourceRef = createRef();
    act(() => {
      create(
        <AnimatedShapeSource
          data={new AnimatedShape({ type: "LineString", coordinates })}
          ref={shapeSourceRef}
        />,
      );
    });

    const setNativePropsSpy = jest.spyOn(
      shapeSourceRef.current,
      "setNativeProps",
    );

    coordinates
      .timing({
        toValue: [
          [21, 21],
          [30, 30],
        ],
        duration: 20,
        easing: Easing.linear,
        useNativeDriver: false,
      })
      .start();

    expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    // process.env.NODE_ENV = 'TEST_butDontSkipSetNativeProps' for future RN
    for (let i = 0; i < 5; i++) {
      clock.tick(4);
      clock.fireRequestAnimationFrames();
      expect(setNativePropsSpy).toHaveBeenCalledTimes(i + 1);
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        shape: {
          type: "LineString",
          coordinates: [
            [1 + (i + 1) * 4, 1 + (i + 1) * 4],
            [10 + (i + 1) * 4, 10 + (i + 1) * 4],
          ],
        },
      });
    }
  });

  test("testAddingCoords", () => {
    AnimatedShapeSource.__skipSetNativeProps_FOR_TESTS_ONLY = false;
    const coordinates = new AnimatedCoordinatesArray([
      [1, 1],
      [10, 10],
    ]);

    const shapeSourceRef = createRef();
    act(() => {
      create(
        <AnimatedShapeSource
          data={new AnimatedShape({ type: "LineString", coordinates })}
          ref={shapeSourceRef}
        />,
      );
    });

    const setNativePropsSpy = jest.spyOn(
      shapeSourceRef.current,
      "setNativeProps",
    );

    coordinates
      .timing({
        toValue: [
          [21, 21],
          [30, 30],
          [50, 50],
        ],
        duration: 20,
        easing: Easing.linear,
        useNativeDriver: false,
      })
      .start();

    expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    for (let i = 0; i < 5; i++) {
      clock.tick(4);
      clock.fireRequestAnimationFrames();
      expect(setNativePropsSpy).toHaveBeenCalledTimes(i + 1);
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        shape: {
          type: "LineString",
          coordinates: [
            [1 + (i + 1) * 4, 1 + (i + 1) * 4],
            [10 + (i + 1) * 4, 10 + (i + 1) * 4],
            [10 + (i + 1) * 8, 10 + (i + 1) * 8],
          ],
        },
      });
    }
  });

  test("testRemovingCoords", () => {
    AnimatedShapeSource.__skipSetNativeProps_FOR_TESTS_ONLY = false;
    const coordinates = new AnimatedCoordinatesArray([
      [1, 1],
      [10, 10],
      [50, 50],
    ]);

    const shapeSourceRef = createRef();
    act(() => {
      create(
        <AnimatedShapeSource
          ref={shapeSourceRef}
          data={new AnimatedShape({ type: "LineString", coordinates })}
        />,
      );
    });

    const setNativePropsSpy = jest.spyOn(
      shapeSourceRef.current,
      "setNativeProps",
    );

    coordinates
      .timing({
        toValue: [
          [21, 21],
          [30, 30],
        ],
        duration: 20,
        easing: Easing.linear,
        useNativeDriver: false,
      })
      .start();

    expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    for (let i = 0; i < 5; i++) {
      clock.tick(4);
      clock.fireRequestAnimationFrames();
      expect(setNativePropsSpy).toHaveBeenCalledTimes(i + 1);
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        shape: {
          type: "LineString",
          coordinates: [
            [1 + (i + 1) * 4, 1 + (i + 1) * 4],
            [10 + (i + 1) * 4, 10 + (i + 1) * 4],
            [50 - (i + 1) * 4, 50 - (i + 1) * 4],
          ],
        },
      });
    }
  });
});
