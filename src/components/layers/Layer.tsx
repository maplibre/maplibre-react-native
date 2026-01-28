import { useMemo } from "react";

import LayerNativeComponent from "./LayerNativeComponent";
import { type BaseProps } from "../../types/BaseProps";
import {
  type BackgroundLayerStyle,
  type CircleLayerStyle,
  type FillExtrusionLayerStyle,
  type FillLayerStyle,
  type FilterExpression,
  type HeatmapLayerStyle,
  type LineLayerStyle,
  type RasterLayerStyle,
  type SymbolLayerStyle,
} from "../../types/MapLibreRNStyles";
import { transformStyle } from "../../utils/StyleValue";
import { getFilter } from "../../utils/getFilter";

/**
 * All supported layer types.
 */
export type LayerType =
  | "fill"
  | "line"
  | "symbol"
  | "circle"
  | "heatmap"
  | "fill-extrusion"
  | "raster"
  | "background";

/**
 * Layer types that require a data source.
 */
export type SourceLayerType = Exclude<LayerType, "background">;

/**
 * Layer types that don't use a data source.
 */
export type StandaloneLayerType = "background";

/**
 * Maps layer type to its specific style interface.
 */
export interface LayerStyleMap {
  fill: FillLayerStyle;
  line: LineLayerStyle;
  symbol: SymbolLayerStyle;
  circle: CircleLayerStyle;
  heatmap: HeatmapLayerStyle;
  "fill-extrusion": FillExtrusionLayerStyle;
  raster: RasterLayerStyle;
  background: BackgroundLayerStyle;
}

/**
 * Common props shared by all layer types.
 */
interface CommonLayerProps extends BaseProps {
  /**
   * A string that uniquely identifies the layer in the style.
   */
  id: string;

  /**
   * The layer will appear under `beforeId`.
   */
  beforeId?: string;

  /**
   * The layer will appear above `afterId`.
   */
  afterId?: string;

  /**
   * Inserts the layer at the specified index.
   */
  layerIndex?: number;

  /**
   * The minimum zoom at which the layer gets parsed and appears.
   */
  minzoom?: number;

  /**
   * The maximum zoom at which the layer gets parsed and appears.
   */
  maxzoom?: number;
}

/**
 * Props for layers that require a data source (fill, line, symbol, circle, heatmap, fill-extrusion, raster).
 */
export interface SourceLayerProps extends CommonLayerProps {
  /**
   * The source from which to obtain the data to style.
   * If the source has not yet been added to the current style, the behavior is undefined.
   * Inferred from parent source only if the layer is a direct child to it.
   */
  source?: string;

  /**
   * Identifier of the layer within the source identified by the source property
   * from which the receiver obtains the data to style.
   */
  "source-layer"?: string;

  /**
   * Filter only the features in the source layer that satisfy a condition that you define.
   */
  filter?: FilterExpression;
}

/**
 * Props for standalone layers that don't use a data source (background).
 */
export interface StandaloneLayerProps extends CommonLayerProps {
  source?: never;
  "source-layer"?: never;
  filter?: never;
}

/**
 * Props for a fill layer.
 */
export type FillLayerProps = SourceLayerProps & {
  type: "fill";
  style?: FillLayerStyle;
};

/**
 * Props for a line layer.
 */
export type LineLayerProps = SourceLayerProps & {
  type: "line";
  style?: LineLayerStyle;
};

/**
 * Props for a symbol layer.
 */
export type SymbolLayerProps = SourceLayerProps & {
  type: "symbol";
  style?: SymbolLayerStyle;
};

/**
 * Props for a circle layer.
 */
export type CircleLayerProps = SourceLayerProps & {
  type: "circle";
  style?: CircleLayerStyle;
};

/**
 * Props for a heatmap layer.
 */
export type HeatmapLayerProps = SourceLayerProps & {
  type: "heatmap";
  style?: HeatmapLayerStyle;
};

/**
 * Props for a fill-extrusion layer.
 */
export type FillExtrusionLayerProps = SourceLayerProps & {
  type: "fill-extrusion";
  style?: FillExtrusionLayerStyle;
};

/**
 * Props for a raster layer.
 */
export type RasterLayerProps = SourceLayerProps & {
  type: "raster";
  style?: RasterLayerStyle;
};

/**
 * Props for a background layer.
 */
export type BackgroundLayerProps = StandaloneLayerProps & {
  type: "background";
  style?: BackgroundLayerStyle;
};

/**
 * Union of all layer props for discriminated union pattern.
 */
export type LayerPropsUnion =
  | FillLayerProps
  | LineLayerProps
  | SymbolLayerProps
  | CircleLayerProps
  | HeatmapLayerProps
  | FillExtrusionLayerProps
  | RasterLayerProps
  | BackgroundLayerProps;

/**
 * Type-safe props for the unified Layer component.
 * When a specific type is provided, the props and style are constrained accordingly.
 *
 * @example
 * // Background layer - source/sourceLayer/filter are not allowed
 * <Layer type="background" id="bg" style={{ backgroundColor: "blue" }} />
 *
 * // Fill layer - all source props are allowed
 * <Layer type="fill" id="parks" source="parks-source" style={{ fillColor: "green" }} />
 */
export type LayerProps<T extends LayerType = LayerType> = T extends "background"
  ? BackgroundLayerProps
  : T extends "fill"
    ? FillLayerProps
    : T extends "line"
      ? LineLayerProps
      : T extends "symbol"
        ? SymbolLayerProps
        : T extends "circle"
          ? CircleLayerProps
          : T extends "heatmap"
            ? HeatmapLayerProps
            : T extends "fill-extrusion"
              ? FillExtrusionLayerProps
              : T extends "raster"
                ? RasterLayerProps
                : LayerPropsUnion;

/**
 * Layer is a style layer that renders geospatial data on the map.
 *
 * This is a unified, type-safe layer component that supports all layer types.
 * The props are constrained based on the `type` prop:
 * - Background layers don't support `source`, `sourceLayer`, or `filter` props
 * - All other layers support these props
 * - The `style` prop is typed according to the layer type
 *
 * @example
 * ```tsx
 * // Fill layer with source
 * <Layer type="fill" id="parks" source="parks-source" style={{ fillColor: "green" }} />
 *
 * // Background layer (no source props allowed)
 * <Layer type="background" id="bg" style={{ backgroundColor: "blue" }} />
 *
 * // Line layer with filter
 * <Layer
 *   type="line"
 *   id="routes"
 *   source="routes-source"
 *   filter={["==", ["get", "type"], "highway"]}
 *   style={{ lineColor: "red", lineWidth: 2 }}
 * />
 * ```
 */
export const Layer = <T extends LayerType>(props: LayerProps<T>) => {
  const nativeProps = useMemo(() => {
    const {
      type: layerType,
      "source-layer": sourceLayer,
      style,
      filter,
      ...rest
    } = props;

    return {
      ...rest,
      layerType,
      sourceLayer,
      filter: getFilter(filter),
      reactStyle: transformStyle(style),
    };
  }, [props]);

  return (
    <LayerNativeComponent
      testID={`mlrn-${props.type}-layer`}
      {...nativeProps}
    />
  );
};
