import {
  type GeolocationPosition,
  Layer,
  type LayerProps,
  LocationManager,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { act, fireEvent, render } from "@testing-library/react-native";

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

async function renderUserLocation(props: UserLocationProps = {}) {
  const result = await render(<UserLocation animated={false} {...props} />);

  function rerender(newProps: UserLocationProps = {}) {
    return result.rerender(<UserLocation {...newProps} />);
  }

  return { ...result, rerender };
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
      const { findByTestId } = await render(<UserLocation />);

      await act(() => {
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

      const { findByTestId } = await render(<UserLocation accuracy />);

      await act(() => {
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

      const { findByTestId } = await render(<UserLocation heading />);

      await act(() => {
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

      const { findByTestId, queryByTestId } = await render(
        <UserLocation heading />,
      );

      await act(() => {
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
        paint: {
          "circle-radius": 5,
          "circle-color": "#ff0000",
        },
      } satisfies LayerProps;

      const { findByTestId, queryByTestId } = await render(
        <UserLocation>
          <Layer {...circleLayerProps} />
        </UserLocation>,
      );

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const geoJSONSource = await findByTestId("mlrn-user-location");
      const circleLayer = await findByTestId(circleLayerProps.testID);
      const defaultCircleLayer = queryByTestId("mlrn-user-location-puck-pulse");

      expect(geoJSONSource).toBeTruthy();
      expect(circleLayer).toBeTruthy();
      expect(defaultCircleLayer).toBeNull();
    });

    test("only when position is available", async () => {
      const { queryByTestId } = await render(<UserLocation />);

      const geoJSONSource = queryByTestId("mlrn-user-location");

      expect(geoJSONSource).toBeNull();
    });
  });

  describe("listeners", () => {
    test("are removed on unmount", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { unmount } = await renderUserLocation();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      await unmount();

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("props", () => {
    test("passes minDisplacement to LocationManager", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      await renderUserLocation({ minDisplacement: 10 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
    });

    test("updates minDisplacement when prop changes", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerender } = await renderUserLocation({
        minDisplacement: 10,
      });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);

      await rerender({ minDisplacement: 20 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(20);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(2);
    });
  });

  describe("event", () => {
    test("onPress when source is pressed", async () => {
      const onPressCallback = jest.fn();

      const { findByTestId } = await render(
        <UserLocation onPress={onPressCallback} />,
      );

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      const geoJSONSource = await findByTestId("mlrn-user-location");

      await fireEvent(geoJSONSource, "onPress");
      await fireEvent(geoJSONSource, "onPress");

      expect(onPressCallback).toHaveBeenCalledTimes(2);
    });
  });
});
