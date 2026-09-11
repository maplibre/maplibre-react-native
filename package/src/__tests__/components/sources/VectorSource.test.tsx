import type { FilterSpecification } from "@maplibre/maplibre-gl-style-spec";
import { render } from "@testing-library/react-native";
import { createRef } from "react";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

import {
  VectorSource,
  type VectorSourceProps,
  type VectorSourceRef,
} from "@/index";

const TEST_ID = "MLRNVectorSource";

async function renderVectorSource(props: Partial<VectorSourceProps> = {}) {
  const sourceRef = createRef<VectorSourceRef>();

  const result = await render(
    <VectorSource
      testID={TEST_ID}
      id="test-vector-source"
      url="https://example.com/tiles.json"
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

describe("VectorSource", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renders", () => {
    test("correctly", async () => {
      const { getByTestId } = await renderVectorSource();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });
  });

  describe("imperative methods", () => {
    test("are exposed on the ref", async () => {
      const { sourceRef } = await renderVectorSource();

      expect(sourceRef.current).toBeDefined();
      expect(typeof sourceRef.current.querySourceFeatures).toBe("function");
      expect(typeof sourceRef.current.setFeatureState).toBe("function");
      expect(typeof sourceRef.current.getFeatureState).toBe("function");
      expect(typeof sourceRef.current.removeFeatureState).toBe("function");
    });

    describe("querySourceFeatures", () => {
      const FEATURES: GeoJSON.Feature[] = [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: {},
        },
      ];

      test("delegates to NativeVectorSourceModule with sourceLayer and filter", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNVectorSourceModule,
            "querySourceFeatures",
          )
          .mockResolvedValue(FEATURES);

        const { sourceRef } = await renderVectorSource();
        const filter: FilterSpecification = ["==", "type", "Point"];
        const result = await sourceRef.current.querySourceFeatures({
          sourceLayer: "my-layer",
          filter,
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.querySourceFeatures,
        ).toHaveBeenCalledWith(expect.any(Number), "my-layer", [
          "==",
          "type",
          "Point",
        ]);
        expect(result).toEqual(FEATURES);
      });

      test("delegates to NativeVectorSourceModule without filter (passes empty array)", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNVectorSourceModule,
            "querySourceFeatures",
          )
          .mockResolvedValue([]);

        const { sourceRef } = await renderVectorSource();
        const result = await sourceRef.current.querySourceFeatures({
          sourceLayer: "roads",
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.querySourceFeatures,
        ).toHaveBeenCalledWith(expect.any(Number), "roads", []);
        expect(result).toEqual([]);
      });

      test("passes a boolean filter as a literal expression", async () => {
        jest
          .spyOn(
            mockNativeModules.MLRNVectorSourceModule,
            "querySourceFeatures",
          )
          .mockResolvedValue([]);

        const { sourceRef } = await renderVectorSource();
        await sourceRef.current.querySourceFeatures({
          sourceLayer: "poi",
          filter: true,
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.querySourceFeatures,
        ).toHaveBeenCalledWith(expect.any(Number), "poi", ["literal", true]);
      });
    });
    describe("setFeatureState", () => {
      test("delegates to NativeVectorSourceModule with sourceLayer and a stringified featureId", async () => {
        const { sourceRef } = await renderVectorSource();
        await sourceRef.current.setFeatureState(
          { sourceLayer: "buildings", featureId: 42 },
          { selected: true },
        );

        expect(
          mockNativeModules.MLRNVectorSourceModule.setFeatureState,
        ).toHaveBeenCalledWith(expect.any(Number), "buildings", "42", {
          selected: true,
        });
      });
    });

    describe("getFeatureState", () => {
      test("delegates to NativeVectorSourceModule and returns the state", async () => {
        jest
          .spyOn(mockNativeModules.MLRNVectorSourceModule, "getFeatureState")
          .mockResolvedValue({ selected: true });

        const { sourceRef } = await renderVectorSource();
        const result = await sourceRef.current.getFeatureState({
          sourceLayer: "buildings",
          featureId: "b-1",
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.getFeatureState,
        ).toHaveBeenCalledWith(expect.any(Number), "buildings", "b-1");
        expect(result).toEqual({ selected: true });
      });
    });

    describe("removeFeatureState", () => {
      test("passes sourceLayer, featureId and key", async () => {
        const { sourceRef } = await renderVectorSource();
        await sourceRef.current.removeFeatureState({
          sourceLayer: "buildings",
          featureId: 7,
          key: "selected",
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.removeFeatureState,
        ).toHaveBeenCalledWith(
          expect.any(Number),
          "buildings",
          "7",
          "selected",
        );
      });

      test("passes null for omitted featureId and key", async () => {
        const { sourceRef } = await renderVectorSource();
        await sourceRef.current.removeFeatureState({
          sourceLayer: "buildings",
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.removeFeatureState,
        ).toHaveBeenCalledWith(expect.any(Number), "buildings", null, null);
      });
    });
  });
});
