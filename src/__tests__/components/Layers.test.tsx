import { render } from "@testing-library/react-native";

import {
  Layer,
  type LayerType,
  type BackgroundLayerProps,
  type CircleLayerProps,
  type FillExtrusionLayerProps,
  type FillLayerProps,
  type HeatmapLayerProps,
  type LineLayerProps,
  type RasterLayerProps,
  type SymbolLayerProps,
} from "@/components/layers/Layer";

describe("Layer Components", () => {
  const layerTestCases: Array<{
    name: string;
    type: LayerType;
    testId: string;
    propsType:
      | BackgroundLayerProps
      | CircleLayerProps
      | FillExtrusionLayerProps
      | FillLayerProps
      | HeatmapLayerProps
      | LineLayerProps
      | RasterLayerProps
      | SymbolLayerProps;
  }> = [
    {
      name: "BackgroundLayer",
      type: "background",
      testId: "mlrn-background-layer",
      propsType: {} as BackgroundLayerProps,
    },
    {
      name: "CircleLayer",
      type: "circle",
      testId: "mlrn-circle-layer",
      propsType: {} as CircleLayerProps,
    },
    {
      name: "FillExtrusionLayer",
      type: "fill-extrusion",
      testId: "mlrn-fill-extrusion-layer",
      propsType: {} as FillExtrusionLayerProps,
    },
    {
      name: "FillLayer",
      type: "fill",
      testId: "mlrn-fill-layer",
      propsType: {} as FillLayerProps,
    },
    {
      name: "HeatmapLayer",
      type: "heatmap",
      testId: "mlrn-heatmap-layer",
      propsType: {} as HeatmapLayerProps,
    },
    {
      name: "LineLayer",
      type: "line",
      testId: "mlrn-line-layer",
      propsType: {} as LineLayerProps,
    },
    {
      name: "RasterLayer",
      type: "raster",
      testId: "mlrn-raster-layer",
      propsType: {} as RasterLayerProps,
    },
    {
      name: "SymbolLayer",
      type: "symbol",
      testId: "mlrn-symbol-layer",
      propsType: {} as SymbolLayerProps,
    },
  ];

  layerTestCases.forEach(({ name, type, testId }) => {
    describe(name, () => {
      test("renders correctly with custom props", () => {
        const testProps = {
          id: "custom-id",
          source: "custom-source",
          sourceLayer: "custom-source-layer",
          beforeId: "custom-before-id",
          afterId: "custom-after-id",
          layerIndex: 0,
          filter: ["==", "arbitraryFilter", true],
          minzoom: 3,
          maxzoom: 8,
          style: { visibility: "none" },
        } as const;

        // Skip source/sourceLayer for background layer
        const layerProps =
          type === "background"
            ? {
                type,
                id: testProps.id,
                beforeId: testProps.beforeId,
                afterId: testProps.afterId,
                layerIndex: testProps.layerIndex,
                minzoom: testProps.minzoom,
                maxzoom: testProps.maxzoom,
                style: testProps.style,
              }
            : {
                type,
                ...testProps,
              };

        const { queryByTestId } = render(<Layer {...(layerProps as any)} />);
        const layer = queryByTestId(testId);
        const { props } = layer!;

        expect(props.id).toStrictEqual(testProps.id);
        if (type !== "background") {
          expect(props.source).toStrictEqual(testProps.source);
          expect(props.sourceLayer).toStrictEqual(testProps.sourceLayer);
          expect(props.filter).toStrictEqual(testProps.filter);
        }
        expect(props.beforeId).toStrictEqual(testProps.beforeId);
        expect(props.afterId).toStrictEqual(testProps.afterId);
        expect(props.layerIndex).toStrictEqual(testProps.layerIndex);
        expect(props.minzoom).toStrictEqual(testProps.minzoom);
        expect(props.maxzoom).toStrictEqual(testProps.maxzoom);
        expect(props.reactStyle).toStrictEqual({
          visibility: {
            styletype: "constant",
            stylevalue: { type: "string", value: testProps.style.visibility },
          },
        });
      });
    });
  });
});
