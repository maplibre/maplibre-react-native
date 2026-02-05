import type { FilterSpecification } from "@maplibre/maplibre-gl-style-spec";
import {
  type LngLat,
  type LngLatBounds,
  Map,
  type MapProps,
  type MapRef,
  type PixelPoint,
  type PixelPointBounds,
} from "@maplibre/maplibre-react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { createRef } from "react";

import { mockNativeModules } from "../__mocks__/NativeModules.mock";

const TEST_ID = "mlrn-map";

function renderMap(props: Omit<MapProps, "mapStyle"> = {}) {
  const mapRef = createRef<MapRef>();

  const result = render(
    <Map
      mapStyle="https://demotiles.maplibre.org/style.json"
      {...props}
      testID={TEST_ID}
      ref={mapRef}
    />,
  );

  const view = result.getByTestId(`${TEST_ID}-view`);
  fireEvent(view, "layout");

  if (mapRef.current === null) {
    throw new Error("Refs can't be null");
  }

  return {
    ...result,
    mapRef: { current: mapRef.current },
  };
}

const CENTER: LngLat = [-73.99155, 40.73581];
const BOUNDS: LngLatBounds = [-74.0, 40.7, -73.9, 40.8];

describe("Map", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("renders", () => {
    test("correctly", () => {
      const { getByTestId } = renderMap();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });

    test("with custom style", () => {
      const style = { flex: 2, backgroundColor: "red" };
      const { getByTestId } = renderMap({ style });

      expect(getByTestId(`${TEST_ID}-view`).props.style).toEqual(style);
    });
  });

  describe("imperative methods", () => {
    test("are exposed", () => {
      const { mapRef } = renderMap();

      expect(mapRef.current).toBeDefined();
      expect(typeof mapRef.current.getCenter).toBe("function");
      expect(typeof mapRef.current.getZoom).toBe("function");
      expect(typeof mapRef.current.getBearing).toBe("function");
      expect(typeof mapRef.current.getPitch).toBe("function");
      expect(typeof mapRef.current.getBounds).toBe("function");
      expect(typeof mapRef.current.getViewState).toBe("function");
      expect(typeof mapRef.current.project).toBe("function");
      expect(typeof mapRef.current.unproject).toBe("function");
      expect(typeof mapRef.current.queryRenderedFeatures).toBe("function");
      expect(typeof mapRef.current.createStaticMapImage).toBe("function");
      expect(typeof mapRef.current.setSourceVisibility).toBe("function");
      expect(typeof mapRef.current.showAttribution).toBe("function");
    });

    test("getCenter", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getCenter")
        .mockResolvedValue(CENTER);

      const { mapRef } = renderMap();
      const result = await mapRef.current.getCenter();

      expect(
        mockNativeModules.MLRNMapViewModule.getCenter,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual(CENTER);
    });

    test("getZoom", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getZoom")
        .mockResolvedValue(16);

      const { mapRef } = renderMap();
      const result = await mapRef.current.getZoom();

      expect(mockNativeModules.MLRNMapViewModule.getZoom).toHaveBeenCalledWith(
        expect.any(Number),
      );
      expect(result).toBe(16);
    });

    test("getBearing", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getBearing")
        .mockResolvedValue(45);

      const { mapRef } = renderMap();
      const result = await mapRef.current.getBearing();

      expect(
        mockNativeModules.MLRNMapViewModule.getBearing,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toBe(45);
    });

    test("getPitch", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getPitch")
        .mockResolvedValue(30);

      const { mapRef } = renderMap();
      const result = await mapRef.current.getPitch();

      expect(mockNativeModules.MLRNMapViewModule.getPitch).toHaveBeenCalledWith(
        expect.any(Number),
      );
      expect(result).toBe(30);
    });

    test("getBounds", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getBounds")
        .mockResolvedValue(BOUNDS);

      const { mapRef } = renderMap();
      const result = await mapRef.current.getBounds();

      expect(
        mockNativeModules.MLRNMapViewModule.getBounds,
      ).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual(BOUNDS);
    });

    test("getViewState", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "getViewState")
        .mockResolvedValue({
          center: CENTER,
          zoom: 16,
          bearing: 45,
          pitch: 30,
          bounds: BOUNDS,
        });

      const { mapRef } = renderMap();
      const result = await mapRef.current.getViewState();

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
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "project")
        .mockResolvedValue([100, 200]);

      const { mapRef } = renderMap();
      const lngLat: LngLat = [-73.99155, 40.73581];
      const result = await mapRef.current.project(lngLat);

      expect(mockNativeModules.MLRNMapViewModule.project).toHaveBeenCalledWith(
        expect.any(Number),
        lngLat,
      );
      expect(result).toEqual([100, 200]);
    });

    test("unproject", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "unproject")
        .mockResolvedValue(CENTER);

      const { mapRef } = renderMap();
      const pixelPoint: PixelPoint = [100, 200];
      const result = await mapRef.current.unproject(pixelPoint);

      expect(
        mockNativeModules.MLRNMapViewModule.unproject,
      ).toHaveBeenCalledWith(expect.any(Number), pixelPoint);
      expect(result).toEqual(CENTER);
    });

    describe("queryRenderedFeatures", () => {
      test("with pixel point", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNMapViewModule,
            "queryRenderedFeaturesWithPoint",
          )
          .mockResolvedValue([]);

        const { mapRef } = renderMap();
        const pixelPoint: PixelPoint = [100, 200];
        const options = {
          layers: ["layer1", "layer2"],
          filter: ["==", "type", "Point"] satisfies FilterSpecification,
        };

        await mapRef.current.queryRenderedFeatures(pixelPoint, options);

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
        jest
          .spyOn(
            mockNativeModules.MLRNMapViewModule,
            "queryRenderedFeaturesWithBounds",
          )
          .mockResolvedValue([]);

        const { mapRef } = renderMap();
        const pixelPointBounds: PixelPointBounds = [
          [100, 100],
          [400, 400],
        ];
        const options = {
          layers: ["layer1"],
          filter: ["==", "type", "Polygon"] satisfies FilterSpecification,
        };

        await mapRef.current.queryRenderedFeatures(pixelPointBounds, options);

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
        jest
          .spyOn(
            mockNativeModules.MLRNMapViewModule,
            "queryRenderedFeaturesWithBounds",
          )
          .mockResolvedValue([]);

        const { mapRef } = renderMap();
        const options = {
          layers: ["layer1"],
        };

        await mapRef.current.queryRenderedFeatures(options);

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds,
        ).toHaveBeenCalledWith(expect.any(Number), null, options.layers, []);
      });

      test("with no options", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNMapViewModule,
            "queryRenderedFeaturesWithBounds",
          )
          .mockResolvedValue([]);

        const { mapRef } = renderMap();

        await mapRef.current.queryRenderedFeatures();

        expect(
          mockNativeModules.MLRNMapViewModule.queryRenderedFeaturesWithBounds,
        ).toHaveBeenCalledWith(expect.any(Number), null, [], []);
      });
    });

    test("createStaticMap", async () => {
      jest
        .spyOn(mockNativeModules.MLRNMapViewModule, "createStaticMapImage")
        .mockResolvedValue("file://test.png");

      const { mapRef } = renderMap();
      const result = await mapRef.current.createStaticMapImage({
        output: "file",
      });

      expect(
        mockNativeModules.MLRNMapViewModule.createStaticMapImage,
      ).toHaveBeenCalledWith(expect.any(Number), "file");
      expect(result).toBe("file://test.png");
    });

    test("setSourceVisibility", async () => {
      const { mapRef } = renderMap();
      await mapRef.current.setSourceVisibility(false, "composite", "building");

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
      const { mapRef } = renderMap();
      await mapRef.current.setSourceVisibility(true, "my-source");

      expect(
        mockNativeModules.MLRNMapViewModule.setSourceVisibility,
      ).toHaveBeenCalledWith(expect.any(Number), true, "my-source", null);
    });

    test("showAttribution", async () => {
      const { mapRef } = renderMap();
      await mapRef.current.showAttribution();

      expect(
        mockNativeModules.MLRNMapViewModule.showAttribution,
      ).toHaveBeenCalledWith(expect.any(Number));
    });
  });
});
