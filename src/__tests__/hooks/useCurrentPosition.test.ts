import {
  useCurrentPosition,
  LocationManager,
  type GeolocationPosition,
} from "@maplibre/maplibre-react-native";
import { renderHook, act } from "@testing-library/react-native";

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

const updatedGeolocationPosition: GeolocationPosition = {
  coords: {
    longitude: 4.2036916,
    latitude: 51.6462244,
    accuracy: 8.5,
    altitude: 45.0,
    altitudeAccuracy: 1.5,
    heading: 180.0,
    speed: 1.5,
  },
  timestamp: 1573730358879,
};

describe("useCurrentPosition", () => {
  beforeEach(() => {
    LocationManager.removeAllListeners();
    LocationManager["currentPosition"] = undefined;

    jest.clearAllMocks();
  });

  describe("initialization", () => {
    test("returns undefined initially when no position is available", () => {
      const { result } = renderHook(() => useCurrentPosition());

      expect(result.current).toBeUndefined();
    });

    test("adds listener on mount", () => {
      jest.spyOn(LocationManager, "addListener");

      renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("removes listener on unmount", () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { unmount } = renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      unmount();

      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("enabled option", () => {
    test("adds listener when enabled is true", () => {
      jest.spyOn(LocationManager, "addListener");

      renderHook(() => useCurrentPosition({ enabled: true }));

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("does not add listener when enabled is false", () => {
      jest.spyOn(LocationManager, "addListener");

      renderHook(() => useCurrentPosition({ enabled: false }));

      expect(LocationManager.addListener).not.toHaveBeenCalled();
    });

    test("adds listener when enabled changes from false to true", () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: false } },
      );

      expect(LocationManager.addListener).not.toHaveBeenCalled();

      rerender({ enabled: true });

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("removes listener when enabled changes from true to false", () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: true } },
      );

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      rerender({ enabled: false });

      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("minDisplacement option", () => {
    test("sets minDisplacement when provided", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      renderHook(() => useCurrentPosition({ minDisplacement: 10 }));

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
    });

    test("does not set minDisplacement when not provided", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      renderHook(() => useCurrentPosition());

      expect(LocationManager.setMinDisplacement).not.toHaveBeenCalled();
    });

    test("updates minDisplacement when it changes", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerender } = renderHook(
        ({ minDisplacement }: { minDisplacement: number }) =>
          useCurrentPosition({ minDisplacement }),
        { initialProps: { minDisplacement: 10 } },
      );

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);

      rerender({ minDisplacement: 20 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(20);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(2);
    });

    test("doesn't update minDisplacement when it doesn't change", () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerender } = renderHook(
        ({ minDisplacement }: { minDisplacement: number }) =>
          useCurrentPosition({ minDisplacement }),
        { initialProps: { minDisplacement: 10 } },
      );

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);

      rerender({ minDisplacement: 10 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);
    });
  });

  describe("location updates", () => {
    test("returns current position after update", () => {
      const { result } = renderHook(() => useCurrentPosition());

      expect(result.current).toBeUndefined();

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toEqual(geolocationPosition);
    });

    test("updates position when location changes", () => {
      const { result } = renderHook(() => useCurrentPosition());

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toEqual(geolocationPosition);

      act(() => {
        LocationManager["handleUpdate"](updatedGeolocationPosition);
      });

      expect(result.current).toEqual(updatedGeolocationPosition);
    });

    test("doesn't update position when disabled", () => {
      const { result } = renderHook(() =>
        useCurrentPosition({ enabled: false }),
      );

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toBeUndefined();
    });

    test("receives existing position when enabled after initial update", () => {
      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: false } },
      );

      act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toBeUndefined();

      act(() => {
        rerender({ enabled: true });
      });

      expect(result.current).toEqual(geolocationPosition);
    });
  });

  describe("listener stability", () => {
    test("uses stable listener callback", () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);

      rerender({});

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();
    });
  });
});
