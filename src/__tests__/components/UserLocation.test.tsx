import { act, fireEvent, render } from "@testing-library/react-native";

import {
  CircleLayer,
  type GeolocationPosition,
  LocationManager,
  UserLocation,
} from "../..";
import type { CircleLayerProps } from "../../components/layers/CircleLayer";
import { type UserLocationProps } from "../../components/user-location/UserLocation";

const geolocationPosition: GeolocationPosition = {
  coords: {
    longitude: 4.1036916,
    latitude: 51.5462244,
    accuracy: 9.977999687194824,
    altitude: 44.64373779296875,
    altitudeAccuracy: 1.477474,
    heading: 251.5358428955078,
    speed: 0.08543474227190018,
  },
  timestamp: 1573730357879,
};

function renderUserLocation(props: UserLocationProps = {}) {
  const result = render(<UserLocation {...props} />);

  function rerenderUserLocation(newProps: UserLocationProps = {}) {
    result.rerender(<UserLocation {...newProps} />);
  }

  return { ...result, rerenderUserLocation };
}

describe("UserLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    test("renders UserLocationPuck by default", async () => {
      const { findByTestId } = render(<UserLocation />);

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const shapeSource = await findByTestId("mlrn-user-location");

      expect(shapeSource).toBeTruthy();
    });

    test("renders custom children when provided", async () => {
      const circleLayerProps = {
        id: "custom-child",
        testID: "custom-child",
        style: {
          circleRadius: 5,
          circleColor: "#ff0000",
        },
      } satisfies CircleLayerProps;

      const { findByTestId, queryByTestId } = render(
        <UserLocation>
          <CircleLayer {...circleLayerProps} />
        </UserLocation>,
      );

      const shapeSource = await findByTestId("mlrn-user-location");
      const circleLayer = await findByTestId(circleLayerProps.testID);
      const defaultCircleLayer = queryByTestId("mlrn-user-location-puck-pulse");

      expect(shapeSource).toBeTruthy();
      expect(circleLayer).toBeTruthy();
      expect(defaultCircleLayer).toBeNull();
    });
  });

  describe("listeners", () => {
    test("are removed on unmount", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { unmount } = renderUserLocation();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      unmount();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });

    test("are only added when necessary", () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerenderUserLocation, unmount } = renderUserLocation();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      rerenderUserLocation({
        onUpdate: jest.fn(),
        renderMode: "hidden",
      });

      expect(LocationManager.addListener).toHaveBeenCalledTimes(2);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);

      rerenderUserLocation({
        onUpdate: jest.fn(),
        renderMode: "hidden",
      });

      expect(LocationManager.addListener).toHaveBeenCalledTimes(3);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(2);

      rerenderUserLocation({
        renderMode: "hidden",
      });

      expect(LocationManager.addListener).toHaveBeenCalledTimes(3);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(3);

      unmount();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(3);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(4);
    });
  });

  describe("event", () => {
    test("onUpdate is called when location changes", () => {
      const handleUpdate = jest.fn();

      render(<UserLocation onUpdate={handleUpdate} />);

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(handleUpdate).toHaveBeenCalledWith(geolocationPosition);
    });

    test("onPress when source is pressed", async () => {
      const onPressCallback = jest.fn();

      const { findByTestId } = render(
        <UserLocation onPress={onPressCallback} />,
      );

      const shapeSource = await findByTestId("mlrn-user-location");

      fireEvent(shapeSource, "onPress");
      fireEvent(shapeSource, "onPress");

      expect(onPressCallback).toHaveBeenCalledTimes(2);
    });
  });
});
