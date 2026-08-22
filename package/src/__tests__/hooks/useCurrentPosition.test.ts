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
    test("returns undefined initially when no position is available", async () => {
      const { result } = await renderHook(() => useCurrentPosition());

      expect(result.current).toBeUndefined();
    });

    test("adds listener on mount", async () => {
      jest.spyOn(LocationManager, "addListener");

      await renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("removes listener on unmount", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { unmount } = await renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      await unmount();

      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("enabled option", () => {
    test("adds listener when enabled is true", async () => {
      jest.spyOn(LocationManager, "addListener");

      await renderHook(() => useCurrentPosition({ enabled: true }));

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("does not add listener when enabled is false", async () => {
      jest.spyOn(LocationManager, "addListener");

      await renderHook(() => useCurrentPosition({ enabled: false }));

      expect(LocationManager.addListener).not.toHaveBeenCalled();
    });

    test("adds listener when enabled changes from false to true", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = await renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: false } },
      );

      expect(LocationManager.addListener).not.toHaveBeenCalled();

      await rerender({ enabled: true });

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
    });

    test("removes listener when enabled changes from true to false", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = await renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: true } },
      );

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();

      await rerender({ enabled: false });

      expect(LocationManager.removeListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("minDisplacement option", () => {
    test("sets minDisplacement when provided", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      await renderHook(() => useCurrentPosition({ minDisplacement: 10 }));

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
    });

    test("does not set minDisplacement when not provided", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      await renderHook(() => useCurrentPosition());

      expect(LocationManager.setMinDisplacement).not.toHaveBeenCalled();
    });

    test("updates minDisplacement when it changes", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerender } = await renderHook(
        ({ minDisplacement }: { minDisplacement: number }) =>
          useCurrentPosition({ minDisplacement }),
        { initialProps: { minDisplacement: 10 } },
      );

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);

      await rerender({ minDisplacement: 20 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(20);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(2);
    });

    test("doesn't update minDisplacement when it doesn't change", async () => {
      jest.spyOn(LocationManager, "setMinDisplacement");

      const { rerender } = await renderHook(
        ({ minDisplacement }: { minDisplacement: number }) =>
          useCurrentPosition({ minDisplacement }),
        { initialProps: { minDisplacement: 10 } },
      );

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledWith(10);
      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);

      await rerender({ minDisplacement: 10 });

      expect(LocationManager.setMinDisplacement).toHaveBeenCalledTimes(1);
    });
  });

  describe("location updates", () => {
    test("returns current position after update", async () => {
      const { result } = await renderHook(() => useCurrentPosition());

      expect(result.current).toBeUndefined();

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toEqual(geolocationPosition);
    });

    test("updates position when location changes", async () => {
      const { result } = await renderHook(() => useCurrentPosition());

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toEqual(geolocationPosition);

      await act(() => {
        LocationManager["handleUpdate"](updatedGeolocationPosition);
      });

      expect(result.current).toEqual(updatedGeolocationPosition);
    });

    test("doesn't update position when disabled", async () => {
      const { result } = await renderHook(() =>
        useCurrentPosition({ enabled: false }),
      );

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toBeUndefined();
    });

    test("receives existing position when enabled after initial update", async () => {
      const { result, rerender } = await renderHook(
        ({ enabled }: { enabled: boolean }) => useCurrentPosition({ enabled }),
        { initialProps: { enabled: false } },
      );

      await act(() => {
        LocationManager["handleUpdate"](geolocationPosition);
      });

      expect(result.current).toBeUndefined();

      await act(async () => {
        await rerender({ enabled: true });
      });

      expect(result.current).toEqual(geolocationPosition);
    });
  });

  describe("listener stability", () => {
    test("uses stable listener callback", async () => {
      jest.spyOn(LocationManager, "addListener");
      jest.spyOn(LocationManager, "removeListener");

      const { rerender } = await renderHook(() => useCurrentPosition());

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);

      await rerender({});

      expect(LocationManager.addListener).toHaveBeenCalledTimes(1);
      expect(LocationManager.removeListener).not.toHaveBeenCalled();
    });
  });
});
