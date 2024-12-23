import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React, { createRef } from "react";

import { CircleLayer, ShapeSource, UserLocation, LocationManager } from "../..";

const position = {
  coords: {
    accuracy: 9.977999687194824,
    altitude: 44.64373779296875,
    heading: 251.5358428955078,
    latitude: 51.5462244,
    longitude: 4.1036916,
    speed: 0.08543474227190018,
    course: 251.5358428955078,
  },
  timestamp: 1573730357879,
};

function renderUserLocation(props = {}) {
  const userLocationRef = createRef();
  const { rerender, unmount } = render(
    <UserLocation {...props} ref={userLocationRef} />,
  );

  function reRenderUserLocation(newProps = {}) {
    rerender(<UserLocation {...newProps} ref={userLocationRef} />);
  }

  return { userLocationRef, reRenderUserLocation, unmount };
}

describe("UserLocation", () => {
  describe("render", () => {
    jest.spyOn(LocationManager, "start").mockImplementation(jest.fn());
    jest
      .spyOn(LocationManager, "getLastKnownLocation")
      .mockImplementation(() => position);

    jest.spyOn(LocationManager, "addListener");

    jest.spyOn(LocationManager, "removeListener");

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("renders with CircleLayers by default", async () => {
      const { UNSAFE_getAllByType } = await render(<UserLocation />);

      const shapeSource = UNSAFE_getAllByType(ShapeSource);
      const circleLayer = UNSAFE_getAllByType(CircleLayer);

      expect(shapeSource.length).toBe(1);
      expect(circleLayer.length).toBe(3);
    });

    test("does not render with visible set to false", async () => {
      const { UNSAFE_queryByType } = await render(
        <UserLocation visible={false} />,
      );

      const shapeSource = UNSAFE_queryByType(ShapeSource);
      const circleLayer = UNSAFE_queryByType(CircleLayer);

      expect(shapeSource).toEqual(null);
      expect(circleLayer).toEqual(null);
    });

    test("renders with CustomChild when provided", async () => {
      const circleLayerProps = {
        key: "testUserLocationCircle",
        id: "testUserLocationCircle",
        style: {
          circleRadius: 5,
          circleColor: "#ccc",
          circleOpacity: 1,
          circlePitchAlignment: "map",
        },
      };

      const { UNSAFE_queryByType, UNSAFE_queryAllByType } = await render(
        <UserLocation>
          <CircleLayer {...circleLayerProps} />
        </UserLocation>,
      );

      const shapeSource = UNSAFE_queryByType(ShapeSource);
      const circleLayer = UNSAFE_queryAllByType(CircleLayer);

      expect(shapeSource).toBeDefined();
      expect(circleLayer[0]).toBeDefined();
      expect(circleLayer.length).toBe(1);

      expect(circleLayer[0].props.style).toEqual(circleLayerProps.style);
    });

    test("calls onUpdate callback when new location is received", () => {
      const onUpdateCallback = jest.fn();

      render(<UserLocation onUpdate={onUpdateCallback} />);

      LocationManager.onUpdate({
        coords: {
          accuracy: 9.977999687194824,
          altitude: 44.64373779296875,
          heading: 251.5358428955078,
          latitude: 51.5462244,
          longitude: 4.1036916,
          speed: 0.08543474227190018,
          course: 251.5358428955078,
        },
        timestamp: 1573730357879,
      });

      expect(onUpdateCallback).toHaveBeenCalled();
    });

    test("calls onPress callback when location icon is pressed", () => {
      const onPressCallback = jest.fn();

      const { UNSAFE_queryByType } = render(
        <UserLocation onPress={onPressCallback} />,
      );

      waitFor(() => {
        const shapeSource = UNSAFE_queryByType(ShapeSource);
        fireEvent(shapeSource, "onPress");
        fireEvent(shapeSource, "onPress");
        expect(onPressCallback).toHaveBeenCalledTimes(2);
      });
    });

    test("correctly unmounts", async () => {
      const { unmount } = renderUserLocation();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      unmount();

      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("methods", () => {
    beforeEach(() => {
      jest.spyOn(LocationManager, "start").mockImplementation(jest.fn());
      jest.spyOn(LocationManager, "stop").mockImplementation(jest.fn());
      jest
        .spyOn(LocationManager, "getLastKnownLocation")
        .mockImplementation(() => position);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("initial state is as expected", () => {
      renderUserLocation();
      expect(LocationManager.start).toHaveBeenCalledTimes(1);
    });

    // TODO: replace object { running: boolean } argument with simple boolean
    describe("#setLocationManager", () => {
      test('called with "running" true', async () => {
        const onUpdate = jest.fn();
        const { userLocationRef } = renderUserLocation({ onUpdate });

        await userLocationRef.current.setLocationManager({ running: true });

        expect(LocationManager.start).toHaveBeenCalledTimes(1);
        expect(LocationManager.getLastKnownLocation).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith({
          coords: {
            accuracy: 9.977999687194824,
            altitude: 44.64373779296875,
            course: 251.5358428955078,
            heading: 251.5358428955078,
            latitude: 51.5462244,
            longitude: 4.1036916,
            speed: 0.08543474227190018,
          },
          timestamp: 1573730357879,
        });

        expect(LocationManager.stop).not.toHaveBeenCalled();
      });

      test('called with "running" false', async () => {
        const { userLocationRef } = renderUserLocation();

        await userLocationRef.current.setLocationManager({ running: true });

        // stop
        await userLocationRef.current.setLocationManager({ running: false });

        // only once from start
        expect(LocationManager.start).toHaveBeenCalledTimes(1);
        // stop should not be called
        expect(LocationManager.stop).not.toHaveBeenCalled();
      });
    });

    describe("#needsLocationManagerRunning", () => {
      test("returns correct values", () => {
        const { userLocationRef, reRenderUserLocation } = renderUserLocation();

        // default props "onUpdate: undefined, visible: true"
        expect(
          userLocationRef.current.needsLocationManagerRunning(),
        ).toStrictEqual(true);

        reRenderUserLocation({
          onUpdate: () => {},
          visible: true,
        });

        expect(
          userLocationRef.current.needsLocationManagerRunning(),
        ).toStrictEqual(true);

        reRenderUserLocation({
          onUpdate: () => {},
          visible: false,
        });

        expect(
          userLocationRef.current.needsLocationManagerRunning(),
        ).toStrictEqual(true);

        reRenderUserLocation({
          visible: false,
        });

        expect(
          userLocationRef.current.needsLocationManagerRunning(),
        ).toStrictEqual(false);
      });
    });

    describe("#_onLocationUpdate", () => {
      test("works correctly", () => {
        const onUpdate = jest.fn();
        const { userLocationRef } = renderUserLocation({
          onUpdate,
        });

        userLocationRef.current._onLocationUpdate(position);

        expect(onUpdate).toHaveBeenCalledWith({
          coords: {
            accuracy: 9.977999687194824,
            altitude: 44.64373779296875,
            course: 251.5358428955078,
            heading: 251.5358428955078,
            latitude: 51.5462244,
            longitude: 4.1036916,
            speed: 0.08543474227190018,
          },
          timestamp: 1573730357879,
        });
      });
    });
  });
});
