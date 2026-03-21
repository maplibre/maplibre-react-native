import type { FilterSpecification } from "@maplibre/maplibre-gl-style-spec";
import { render } from "@testing-library/react-native";
import { createRef } from "react";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

import {
  GeoJSONSource,
  type GeoJSONSourceProps,
  type GeoJSONSourceRef,
} from "@/index";

const TEST_ID = "MLRNGeoJSONSource";

function renderGeoJSONSource(props: Partial<GeoJSONSourceProps> = {}) {
  const sourceRef = createRef<GeoJSONSourceRef>();

  const result = render(
    <GeoJSONSource
      testID={TEST_ID}
      id="test-geojson-source"
      data={{ type: "FeatureCollection", features: [] }}
      {...props}
      ref={sourceRef}
    />,
  );

  if (sourceRef.current === null) {
    throw new Error("Ref can't be null");
  }

  return {
    ...result,
    sourceRef: { current: sourceRef.current },
  };
}

describe("GeoJSONSource", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renders", () => {
    test("correctly", () => {
      const { getByTestId } = renderGeoJSONSource();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });
  });

  describe("imperative methods", () => {
    test("are exposed on the ref", () => {
      const { sourceRef } = renderGeoJSONSource();

      expect(sourceRef.current).toBeDefined();
      expect(typeof sourceRef.current.getData).toBe("function");
      expect(typeof sourceRef.current.getClusterExpansionZoom).toBe("function");
      expect(typeof sourceRef.current.getClusterLeaves).toBe("function");
      expect(typeof sourceRef.current.getClusterChildren).toBe("function");
    });

    describe("getData", () => {
      const FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [1, 2] },
            properties: { name: "test" },
          },
        ],
      };

      test("delegates to NativeGeoJSONSourceModule without filter", async () => {
        jest
          .spyOn(mockNativeModules.MLRNGeoJSONSourceModule, "getData")
          .mockResolvedValue(FEATURE_COLLECTION);

        const { sourceRef } = renderGeoJSONSource();
        const result = await sourceRef.current.getData();

        expect(
          mockNativeModules.MLRNGeoJSONSourceModule.getData,
        ).toHaveBeenCalledWith(expect.any(Number), []);
        expect(result).toEqual(FEATURE_COLLECTION);
      });

      test("delegates to NativeGeoJSONSourceModule with an array filter", async () => {
        jest
          .spyOn(mockNativeModules.MLRNGeoJSONSourceModule, "getData")
          .mockResolvedValue(FEATURE_COLLECTION);

        const { sourceRef } = renderGeoJSONSource();
        const filter: FilterSpecification = ["==", "name", "test"];
        const result = await sourceRef.current.getData(filter);

        expect(
          mockNativeModules.MLRNGeoJSONSourceModule.getData,
        ).toHaveBeenCalledWith(expect.any(Number), ["==", "name", "test"]);
        expect(result).toEqual(FEATURE_COLLECTION);
      });
    });

    describe("getClusterExpansionZoom", () => {
      test("delegates to NativeGeoJSONSourceModule with clusterId", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNGeoJSONSourceModule,
            "getClusterExpansionZoom",
          )
          .mockResolvedValue(8);

        const { sourceRef } = renderGeoJSONSource();
        const result = await sourceRef.current.getClusterExpansionZoom(42);

        expect(
          mockNativeModules.MLRNGeoJSONSourceModule.getClusterExpansionZoom,
        ).toHaveBeenCalledWith(expect.any(Number), 42);
        expect(result).toBe(8);
      });
    });

    describe("getClusterLeaves", () => {
      const LEAVES: GeoJSON.Feature[] = [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: {},
        },
      ];

      test("delegates to NativeGeoJSONSourceModule with clusterId, limit, and offset", async () => {
        jest
          .spyOn(mockNativeModules.MLRNGeoJSONSourceModule, "getClusterLeaves")
          .mockResolvedValue(LEAVES);

        const { sourceRef } = renderGeoJSONSource();
        const result = await sourceRef.current.getClusterLeaves(7, 10, 20);

        expect(
          mockNativeModules.MLRNGeoJSONSourceModule.getClusterLeaves,
        ).toHaveBeenCalledWith(expect.any(Number), 7, 10, 20);
        expect(result).toEqual(LEAVES);
      });
    });

    describe("getClusterChildren", () => {
      const CHILDREN: GeoJSON.Feature[] = [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 1] },
          properties: {},
        },
      ];

      test("delegates to NativeGeoJSONSourceModule with clusterId", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNGeoJSONSourceModule,
            "getClusterChildren",
          )
          .mockResolvedValue(CHILDREN);

        const { sourceRef } = renderGeoJSONSource();
        const result = await sourceRef.current.getClusterChildren(99);

        expect(
          mockNativeModules.MLRNGeoJSONSourceModule.getClusterChildren,
        ).toHaveBeenCalledWith(expect.any(Number), 99);
        expect(result).toEqual(CHILDREN);
      });
    });
  });
});
