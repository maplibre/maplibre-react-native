import type {
  LngLat,
  PixelPoint,
  PixelPointBounds,
  MapView,
  type MapViewProps,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { createRef } from "react";

import type { LngLatBounds } from "../../types/LngLatBounds";
import { mockNativeModules } from "../__mocks__/NativeModules.mock";

// Mock findNodeHandle to return a valid tag
jest.mock("react-native", () => {
  const actualReactNative = jest.requireActual("react-native");
  return {
    ...actualReactNative,
    findNodeHandle: jest.fn(() => 1),
  };
});

const TEST_ID = "MLRNMapView";

function renderMapView(props: MapViewProps = {}) {
  const mapViewRef = createRef<MapViewRef>();

  const result = render(
    <MapView testID={TEST_ID} {...props} ref={mapViewRef} />,
  );

  // Trigger onLayout to make the map ready
  const container = result.getByTestId(TEST_ID);
  fireEvent(container, "layout");

  if (mapViewRef.current === null) {
    throw new Error("Refs can't be null");
  }

  return {
    ...result,
    mapViewRef: { current: mapViewRef.current },
  };
}

const CENTER: LngLat = [-73.99155, 40.73581];
const BOUNDS: LngLatBounds = [-74.0, 40.7, -73.9, 40.8];

describe("MapView", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks for MapView module
    mockNativeModules.MLRNMapViewModule.getCenter = jest.fn(() =>
      Promise.resolve(CENTER),
    );
    mockNativeModules.MLRNMapViewModule.getZoom = jest.fn(() =>
      Promise.resolve(16),
    );
    mockNativeModules.MLRNMapViewModule.getBearing = jest.fn(() =>
      Promise.resolve(45),
    );
    mockNativeModules.MLRNMapViewModule.getPitch = jest.fn(() =>
      Promise.resolve(30),
    );
    mockNativeModules.MLRNMapViewModule.getBounds = jest.fn(() =>
      Promise.resolve(BOUNDS),
    );
    mockNativeModules.MLRNMapViewModule.getViewState = jest.fn(() =>
      Promise.resolve({
        center: CENTER,
        zoom: 16,
        bearing: 45,
        pitch: 30,
        bounds: BOUNDS,
      }),
    );
    mockNativeModules.MLRNMapViewModule.project = jest.fn(() =>
      Promise.resolve([100, 200]),
    );
    mockNativeModules.MLRNMapViewModule.unproject = jest.fn(() =>
      Promise.resolve(CENTER),
    );
    mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithPoint =
      jest.fn(() => Promise.resolve([]));
    mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds =
      jest.fn(() => Promise.resolve([]));
    mockNativeModules.MLRNMapViewModule.takeSnap = jest.fn(() =>
      Promise.resolve("file://snapshot.png"),
    );
    mockNativeModules.MLRNMapViewModule.setSourceVisibility = jest.fn(() =>
      Promise.resolve(),
    );
    mockNativeModules.MLRNMapViewModule.showAttribution = jest.fn(() =>
      Promise.resolve(),
    );
  });

  describe("renders", () => {
    test("correctly", () => {
      const { getByTestId } = renderMapView();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });

    test("with custom style", () => {
      const style = { flex: 2, backgroundColor: "red" };
      const { getByTestId } = renderMapView({ style });

      expect(getByTestId(TEST_ID).props.style).toEqual(style);
    });
  });

  describe("imperative methods", () => {
    test("are exposed", () => {
      const { mapViewRef } = renderMapView();

      expect(mapViewRef.current).toBeDefined();
      expect(typeof mapViewRef.current.getCenter).toBe("function");
      expect(typeof mapViewRef.current.getZoom).toBe("function");
      expect(typeof mapViewRef.current.getBearing).toBe("function");
      expect(typeof mapViewRef.current.getPitch).toBe("function");
      expect(typeof mapViewRef.current.getBounds).toBe("function");
      expect(typeof mapViewRef.current.getViewState).toBe("function");
      expect(typeof mapViewRef.current.project).toBe("function");
      expect(typeof mapViewRef.current.unproject).toBe("function");
      expect(typeof mapViewRef.current.queryRenderedFeatures).toBe("function");
      expect(typeof mapViewRef.current.takeSnap).toBe("function");
      expect(typeof mapViewRef.current.setSourceVisibility).toBe("function");
      expect(typeof mapViewRef.current.showAttribution).toBe("function");
    });

    test("getCenter", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getCenter();

      expect(
        mockNativeModules.MLRNMapViewModule.getCenter,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual(CENTER);
    });

    test("getZoom", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getZoom();

      expect(mockNativeModules.MLRNMapViewModule.getZoom).toHaveBeenCalledWith(
        expect.any(Number),
      );
      expect(result).toBe(16);
    });

    test("getBearing", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getBearing();

      expect(
        mockNativeModules.MLRNMapViewModule.getBearing,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toBe(45);
    });

    test("getPitch", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getPitch();

      expect(mockNativeModules.MLRNMapViewModule.getPitch).toHaveBeenCalledWith(
        expect.any(Number),
      );
      expect(result).toBe(30);
    });

    test("getBounds", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getBounds();

      expect(
        mockNativeModules.MLRNMapViewModule.getBounds,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual(BOUNDS);
    });

    test("getViewState", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.getViewState();

      expect(
        mockNativeModules.MLRNMapViewModule.getViewState,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({
        center: CENTER,
        zoom: 16,
        bearing: 45,
        pitch: 30,
        bounds: BOUNDS,
      });
    });

    test("project", async () => {
      const { mapViewRef } = renderMapView();
      const lngLat: LngLat = [-73.99155, 40.73581];
      const result = await mapViewRef.current.project(lngLat);

      expect(mockNativeModules.MLRNMapViewModule.project).toHaveBeenCalledWith(
        expect.any(Number),
        lngLat,
      );
      expect(result).toEqual([100, 200]);
    });

    test("unproject", async () => {
      const { mapViewRef } = renderMapView();
      const pixelPoint: PixelPoint = [100, 200];
      const result = await mapViewRef.current.unproject(pixelPoint);

      expect(
        mockNativeModules.MLRNMapViewModule.unproject,
      ).toHaveBeenCalledWith(expect.any(Number), pixelPoint);
      expect(result).toEqual(CENTER);
    });

    describe("queryRenderedFeatures", () => {
      test("with pixel point", async () => {
        const { mapViewRef } = renderMapView();
        const pixelPoint: PixelPoint = [100, 200];
        const options = {
          layers: ["layer1", "layer2"],
          filter: ["==", "type", "Point"] as const,
        };

        await mapViewRef.current.queryRenderedFeatures(pixelPoint, options);

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithPoint,
        ).toHaveBeenCalledWith(
          expect.any(Number),
          pixelPoint,
          options.layers,
          expect.any(Array),
        );
      });

      test("with pixel bounds", async () => {
        const { mapViewRef } = renderMapView();
        const pixelPointBounds: PixelPointBounds = [
          [100, 100],
          [400, 400],
        ] as const;
        const options = {
          layers: ["layer1"],
          filter: ["==", "type", "Polygon"] as const,
        };

        await mapViewRef.current.queryRenderedFeatures(
          pixelPointBounds,
          options,
        );

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds,
        ).toHaveBeenCalledWith(
          expect.any(Number),
          pixelPointBounds,
          options.layers,
          expect.any(Array),
        );
      });

      test("with no bounds (whole viewport)", async () => {
        const { mapViewRef } = renderMapView();
        const options = {
          layers: ["layer1"],
        };

        await mapViewRef.current.queryRenderedFeatures(options);

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds,
        ).toHaveBeenCalledWith(expect.any(Number), null, options.layers, []);
      });

      test("with no options", async () => {
        const { mapViewRef } = renderMapView();

        await mapViewRef.current.queryRenderedFeatures();

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds,
        ).toHaveBeenCalledWith(expect.any(Number), null, [], []);
      });
    });

    test("takeSnap with writeToDisk=false", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.takeSnap(false);

      expect(mockNativeModules.MLRNMapViewModule.takeSnap).toHaveBeenCalledWith(
        expect.any(Number),
        false,
      );
      expect(result).toBe("file://snapshot.png");
    });

    test("takeSnap with writeToDisk=true", async () => {
      const { mapViewRef } = renderMapView();
      const result = await mapViewRef.current.takeSnap(true);

      expect(mockNativeModules.MLRNMapViewModule.takeSnap).toHaveBeenCalledWith(
        expect.any(Number),
        true,
      );
      expect(result).toBe("file://snapshot.png");
    });

    test("setSourceVisibility", async () => {
      const { mapViewRef } = renderMapView();
      await mapViewRef.current.setSourceVisibility(
        false,
        "composite",
        "building",
      );

      expect(
        mockNativeModules.MLRNMapViewModule.setSourceVisibility,
      ).toHaveBeenCalledWith(
        expect.any(Number),
        false,
        "composite",
        "building",
      );
    });

    test("setSourceVisibility without sourceLayer", async () => {
      const { mapViewRef } = renderMapView();
      await mapViewRef.current.setSourceVisibility(true, "my-source");

      expect(
        mockNativeModules.MLRNMapViewModule.setSourceVisibility,
      ).toHaveBeenCalledWith(expect.any(Number), true, "my-source", null);
    });

    test("showAttribution", async () => {
      const { mapViewRef } = renderMapView();
      await mapViewRef.current.showAttribution();

      expect(
        mockNativeModules.MLRNMapViewModule.showAttribution,
      ).toHaveBeenCalledWith(expect.any(Number));
    });
  });
});
