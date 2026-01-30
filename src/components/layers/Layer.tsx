import { useMemo } from "react";

import LayerNativeComponent from "./LayerNativeComponent";
import { useFrozenId } from "../../hooks/useFrozenId";
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
 * Common props shared by all layer types.
 */
interface BaseLayerProps extends BaseProps {
  /**
   * A string that uniquely identifies the layer in the style.
   */
  id?: string;

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
 * Props for standalone layers that don't use a data source (background).
 */
export interface StandaloneLayerProps extends BaseLayerProps {
  source?: never;
  "source-layer"?: never;
  filter?: never;
}

/**
 * Props for layers that require a data source (fill, line, symbol, circle, heatmap, fill-extrusion, raster).
 */
export interface SourceLayerProps extends BaseLayerProps {
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
 * Props for a background layer.
 */
export type BackgroundLayerProps = BaseLayerProps & {
  type: "background";
  style?: BackgroundLayerStyle;
};

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
 * Union of all layer props for discriminated union pattern.
 */
export type LayerProps =
  | FillLayerProps
  | LineLayerProps
  | SymbolLayerProps
  | CircleLayerProps
  | HeatmapLayerProps
  | FillExtrusionLayerProps
  | RasterLayerProps
  | BackgroundLayerProps;

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
export const Layer = ({ id, ...props }: LayerProps) => {
  const frozenId = useFrozenId(id);

  const nativeProps = useMemo(() => {
    const {
      type: layerType,
      "source-layer": sourceLayer,
      filter,
      style,
      ...rest
    } = { "source-layer": undefined, filter: undefined, ...props };

    return {
      ...rest,
      layerType,
      sourceLayer,
      filter: getFilter(filter),
      reactStyle: transformStyle(style),
    };
  }, [props]);

  console.log(nativeProps.reactStyle);

  return (
    <LayerNativeComponent
      id={frozenId}
      testID={`mlrn-${props.type}-layer`}
      {...nativeProps}
    />
  );
};
