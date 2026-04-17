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

function renderVectorSource(props: Partial<VectorSourceProps> = {}) {
  const sourceRef = createRef<VectorSourceRef>();

  const result = render(
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
    test("correctly", () => {
      const { getByTestId } = renderVectorSource();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });
  });

  describe("imperative methods", () => {
    test("are exposed on the ref", () => {
      const { sourceRef } = renderVectorSource();

      expect(sourceRef.current).toBeDefined();
      expect(typeof sourceRef.current.querySourceFeatures).toBe("function");
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

        const { sourceRef } = renderVectorSource();
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

        const { sourceRef } = renderVectorSource();
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

        const { sourceRef } = renderVectorSource();
        await sourceRef.current.querySourceFeatures({
          sourceLayer: "poi",
          filter: true,
        });

        expect(
          mockNativeModules.MLRNVectorSourceModule.querySourceFeatures,
        ).toHaveBeenCalledWith(expect.any(Number), "poi", ["literal", true]);
      });
    });
  });
});
