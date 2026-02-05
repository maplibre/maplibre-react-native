import {
  Layer,
  type GeolocationPosition,
  LocationManager,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { act, fireEvent, render } from "@testing-library/react-native";

import type { CircleLayerProps } from "@/components/layer/Layer";
import type { UserLocationProps } from "@/components/user-location/UserLocation";

jest.useFakeTimers();

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("renders", () => {
    test("UserLocationPuck by default", async () => {
      const { findByTestId } = render(<UserLocation />);

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const geoJSONSource = await findByTestId("mlrn-user-location");

      expect(geoJSONSource).toBeTruthy();
    });

    test("accuracy 0", async () => {
      const positionWithZeroAccuracy: GeolocationPosition = {
        ...geolocationPosition,
        coords: {
          ...geolocationPosition.coords,
          accuracy: 0,
        },
      };

      const { findByTestId } = render(<UserLocation accuracy />);

      act(() => {
        LocationManager["handleUpdate"](positionWithZeroAccuracy);
      });

      const accuracyLayer = await findByTestId(
        "mlrn-user-location-puck-accuracy",
      );

      expect(accuracyLayer).toBeTruthy();
    });

    test("heading 0", async () => {
      const positionWithZeroHeading: GeolocationPosition = {
        ...geolocationPosition,
        coords: {
          ...geolocationPosition.coords,
          heading: 0,
        },
      };

      const { findByTestId } = render(<UserLocation heading />);

      act(() => {
        LocationManager["handleUpdate"](positionWithZeroHeading);
      });

      const headingLayer = await findByTestId(
        "mlrn-user-location-puck-heading",
      );

      expect(headingLayer).toBeTruthy();
    });

    test("heading only when not null", async () => {
      const positionWithNullHeading: GeolocationPosition = {
        ...geolocationPosition,
        coords: {
          ...geolocationPosition.coords,
          heading: null,
        },
      };

      const { findByTestId, queryByTestId } = render(<UserLocation heading />);

      act(() => {
        LocationManager["handleUpdate"](positionWithNullHeading);
      });

      await findByTestId("mlrn-user-location");

      const headingLayer = queryByTestId("mlrn-user-location-puck-heading");

      expect(headingLayer).toBeNull();
    });

    test("custom children", async () => {
      const circleLayerProps = {
        type: "circle",
        id: "custom-child",
        testID: "custom-child",
        style: {
          circleRadius: 5,
          circleColor: "#ff0000",
        },
      } satisfies CircleLayerProps;

      const { findByTestId, queryByTestId } = render(
        <UserLocation>
          <Layer {...circleLayerProps} />
        </UserLocation>,
      );

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const geoJSONSource = await findByTestId("mlrn-user-location");
      const circleLayer = await findByTestId(circleLayerProps.testID);
      const defaultCircleLayer = queryByTestId("mlrn-user-location-puck-pulse");

      expect(geoJSONSource).toBeTruthy();
      expect(circleLayer).toBeTruthy();
      expect(defaultCircleLayer).toBeNull();
    });

    test("only when position is available", () => {
      const { queryByTestId } = render(<UserLocation />);

      const geoJSONSource = queryByTestId("mlrn-user-location");

      expect(geoJSONSource).toBeNull();
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

      const geoJSONSource = await findByTestId("mlrn-user-location");

      fireEvent(geoJSONSource, "onPress");
      fireEvent(geoJSONSource, "onPress");

      expect(onPressCallback).toHaveBeenCalledTimes(2);
    });
  });
});
