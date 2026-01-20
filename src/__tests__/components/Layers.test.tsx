import { render } from "@testing-library/react-native";

import { BackgroundLayer } from "@/components/layers/BackgroundLayer";
import type { BackgroundLayerProps } from "@/components/layers/BackgroundLayer";
import { CircleLayer } from "@/components/layers/CircleLayer";
import type { CircleLayerProps } from "@/components/layers/CircleLayer";
import { FillExtrusionLayer } from "@/components/layers/FillExtrusionLayer";
import type { FillExtrusionLayerProps } from "@/components/layers/FillExtrusionLayer";
import { FillLayer } from "@/components/layers/FillLayer";
import type { FillLayerProps } from "@/components/layers/FillLayer";
import { HeatmapLayer } from "@/components/layers/HeatmapLayer";
import type { HeatmapLayerProps } from "@/components/layers/HeatmapLayer";
import { LineLayer } from "@/components/layers/LineLayer";
import type { LineLayerProps } from "@/components/layers/LineLayer";
import { RasterLayer } from "@/components/layers/RasterLayer";
import type { RasterLayerProps } from "@/components/layers/RasterLayer";
import { SymbolLayer } from "@/components/layers/SymbolLayer";
import type { SymbolLayerProps } from "@/components/layers/SymbolLayer";

describe("Layer Components", () => {
  const layerTestCases = [
    {
      name: "BackgroundLayer",
      Component: BackgroundLayer,
      testId: "mlrn-background-layer",
      propsType: {} as BackgroundLayerProps,
    },
    {
      name: "CircleLayer",
      Component: CircleLayer,
      testId: "mlrn-circle-layer",
      propsType: {} as CircleLayerProps,
    },
    {
      name: "FillExtrusionLayer",
      Component: FillExtrusionLayer,
      testId: "mlrn-fill-extrusion-layer",
      propsType: {} as FillExtrusionLayerProps,
    },
    {
      name: "FillLayer",
      Component: FillLayer,
      testId: "mlrn-fill-layer",
      propsType: {} as FillLayerProps,
    },
    {
      name: "HeatmapLayer",
      Component: HeatmapLayer,
      testId: "mlrn-heatmap-layer",
      propsType: {} as HeatmapLayerProps,
    },
    {
      name: "LineLayer",
      Component: LineLayer,
      testId: "mlrn-line-layer",
      propsType: {} as LineLayerProps,
    },
    {
      name: "RasterLayer",
      Component: RasterLayer,
      testId: "mlrn-raster-layer",
      propsType: {} as RasterLayerProps,
    },
    {
      name: "SymbolLayer",
      Component: SymbolLayer,
      testId: "mlrn-symbol-layer",
      propsType: {} as SymbolLayerProps,
    },
  ];

  layerTestCases.forEach(({ name, Component, testId, propsType }) => {
    describe(name, () => {
      test("renders correctly with custom props", () => {
        const testProps = {
          id: "custom-id",
          source: "custom-source",
          "source-layer": "custom-source-layer",
          beforeId: "custom-before-id",
          afterId: "custom-after-id",
          layerIndex: 0,
          filter: ["==", "arbitraryFilter", true],
          minzoom: 3,
          maxzoom: 8,
          style: { visibility: "none" },
        } as const satisfies typeof propsType;

        const { queryByTestId } = render(<Component {...testProps} />);
        const layer = queryByTestId(testId);
        const { props } = layer;

        expect(props.id).toStrictEqual(testProps.id);
        expect(props.source).toStrictEqual(testProps.source);
        expect(props["source-layer"]).toStrictEqual(testProps["source-layer"]);
        expect(props.beforeId).toStrictEqual(testProps.beforeId);
        expect(props.afterId).toStrictEqual(testProps.afterId);
        expect(props.layerIndex).toStrictEqual(testProps.layerIndex);
        expect(props.filter).toStrictEqual(testProps.filter);
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
