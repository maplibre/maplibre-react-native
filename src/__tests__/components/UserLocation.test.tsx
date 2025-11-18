import { act, fireEvent, render } from "@testing-library/react-native";

import {
  CircleLayer,
  type GeolocationPosition,
  LocationManager,
  ShapeSource,
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
  const result = render(<UserLocation animated={false} {...props} />);

  function rerenderUserLocation(newProps: UserLocationProps = {}) {
    result.rerender(<UserLocation {...newProps} />);
  }

  return { ...result, rerenderUserLocation };
}

describe("UserLocation", () => {
  beforeEach(() => {
    LocationManager.removeAllListeners();
    LocationManager["currentPosition"] = undefined;

    jest.mock("../../utils/animated/Animated", () => ({
      Animated: {
        ShapeSource: jest.requireActual("../components/ShapeSource")
          .ShapeSource,
      },
    }));
  });

  afterEach(() => {
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

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const shapeSource = await findByTestId("mlrn-user-location");
      const circleLayer = await findByTestId(circleLayerProps.testID);
      const defaultCircleLayer = queryByTestId("mlrn-user-location-puck-pulse");

      expect(shapeSource).toBeTruthy();
      expect(circleLayer).toBeTruthy();
      expect(defaultCircleLayer).toBeNull();
    });

    test("does not render when position is not available", () => {
      const { queryByTestId } = render(<UserLocation />);

      const shapeSource = queryByTestId("mlrn-user-location");

      expect(shapeSource).toBeNull();
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
  });

  describe("props", () => {
    test("passes minDisplacement to LocationManager", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      renderUserLocation({ minDisplacement: 10 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
    });

    test("updates minDisplacement when prop changes", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerenderUserLocation } = renderUserLocation({
        minDisplacement: 10,
      });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);

      rerenderUserLocation({ minDisplacement: 20 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(20);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(2);
    });
  });

  describe("event", () => {
    test("onPress when source is pressed", async () => {
      const onPressCallback = jest.fn();

      const { findByTestId } = render(
        <UserLocation onPress={onPressCallback} />,
      );

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const shapeSource = await findByTestId("mlrn-user-location");

      fireEvent(shapeSource, "onPress");
      fireEvent(shapeSource, "onPress");

      expect(onPressCallback).toHaveBeenCalledTimes(2);
    });
  });
});
