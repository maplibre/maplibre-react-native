import { render } from "@testing-library/react-native";

import { Layer, type LayerProps } from "@/components/layer/Layer";

describe("Layer Components", () => {
  const layerTestCases: {
    name: string;
    props: LayerProps;
  }[] = [
    {
      name: "BackgroundLayer",
      props: {
        type: "background",
      },
    },
    {
      name: "CircleLayer",
      props: {
        type: "circle",
      },
    },
    {
      name: "FillExtrusionLayer",
      props: {
        type: "fill-extrusion",
      },
    },
    {
      name: "FillLayer",
      props: {
        type: "fill",
      },
    },
    {
      name: "HeatmapLayer",
      props: {
        type: "heatmap",
      },
    },
    {
      name: "LineLayer",
      props: {
        type: "line",
      },
    },
    {
      name: "RasterLayer",
      props: {
        type: "raster",
      },
    },
    {
      name: "SymbolLayer",

      props: {
        type: "symbol",
      },
    },
  ];

  layerTestCases.forEach(({ name, props: { type } }) => {
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
          layout: { visibility: "none" },
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
                layout: testProps.layout,
              }
            : {
                type,
                ...testProps,
              };

        const { queryByTestId } = render(<Layer {...(layerProps as any)} />);
        const layer = queryByTestId(`mlrn-${type}-layer`);
        const { props } = layer!;

        expect(props.id).toStrictEqual(testProps.id);
        if (type !== "background") {
          expect(props.source).toStrictEqual(testProps.source);
          expect(props.sourceLayer).toStrictEqual(testProps["source-layer"]);
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
            stylevalue: { type: "string", value: testProps.layout.visibility },
          },
        });
      });
    });
  });
});
