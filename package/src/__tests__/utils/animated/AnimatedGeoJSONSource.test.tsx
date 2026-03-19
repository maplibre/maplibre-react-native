import {
  Animated,
  type GeoJSONSourceRef,
} from "@maplibre/maplibre-react-native";
import { act, render } from "@testing-library/react-native";
import { createRef } from "react";
import { Easing } from "react-native";

const TEST_ID = "MLRNGeoJSONSource";

jest.useFakeTimers();

describe("AnimatedGeoJSONSource", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("linear easing", () => {
    const coordinates = new Animated.CoordinatesArray([
      [1, 1],
      [2, 2],
    ]);

    const geoJSONSourceRef = createRef<GeoJSONSourceRef>();
    const { getByTestId } = render(
      <Animated.GeoJSONSource
        testID={TEST_ID}
        data={new Animated.GeoJSON({ type: "LineString", coordinates })}
        ref={geoJSONSourceRef}
      />,
    );

    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    });

    coordinates
      .timing({
        toValue: [
          [2, 2],
          [4, 4],
        ],
        duration: 2,
        easing: Easing.linear,
      })
      .start();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [1.5, 1.5],
        [3, 3],
      ],
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [2, 2],
        [4, 4],
      ],
    });
  });

  test("adding coordinates", () => {
    const coordinates = new Animated.CoordinatesArray([
      [1, 1],
      [2, 2],
    ]);

    const geoJSONSourceRef = createRef<GeoJSONSourceRef>();
    const { getByTestId } = render(
      <Animated.GeoJSONSource
        testID={TEST_ID}
        data={new Animated.GeoJSON({ type: "LineString", coordinates })}
        ref={geoJSONSourceRef}
      />,
    );

    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    });

    coordinates
      .timing({
        toValue: [
          [2, 2],
          [4, 4],
          [8, 8],
        ],
        duration: 2,
        easing: Easing.linear,
      })
      .start();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [1.5, 1.5],
        [3, 3],
        [5, 5],
      ],
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [2, 2],
        [4, 4],
        [8, 8],
      ],
    });
  });

  test("removing coordinates", () => {
    const coordinates = new Animated.CoordinatesArray([
      [2, 2],
      [4, 4],
      [8, 8],
    ]);

    const geoJSONSourceRef = createRef<GeoJSONSourceRef>();
    const { getByTestId } = render(
      <Animated.GeoJSONSource
        testID={TEST_ID}
        data={new Animated.GeoJSON({ type: "LineString", coordinates })}
        ref={geoJSONSourceRef}
      />,
    );

    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [2, 2],
        [4, 4],
        [8, 8],
      ],
    });

    coordinates
      .timing({
        toValue: [
          [2, 2],
          [4, 4],
        ],
        duration: 2,
        easing: Easing.linear,
      })
      .start();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [2, 2],
        [4, 4],
        [6, 6],
      ],
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(JSON.parse(getByTestId(TEST_ID).props.data)).toEqual({
      type: "LineString",
      coordinates: [
        [2, 2],
        [4, 4],
        [4, 4],
      ],
    });
  });
});
