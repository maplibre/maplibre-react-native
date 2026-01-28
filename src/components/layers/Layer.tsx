import { useMemo } from "react";

import LayerNativeComponent from "./LayerNativeComponent";
import { type BaseProps } from "../../types/BaseProps";
import {
  type AllLayerStyle,
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
 * Base props shared by all layer types.
 */
export interface BaseLayerProps extends BaseProps {
  /**
   * A string that uniquely identifies the layer in the style.
   */
  id: string;

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
  sourceLayer?: string;

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

  /**
   * Filter only the features in the source layer that satisfy a condition that you define.
   */
  filter?: FilterExpression;

  /**
   * Customizable style attributes.
   */
  style?: AllLayerStyle;
}

/**
 * Props for the unified Layer component.
 */
export type LayerProps<T extends LayerType = LayerType> = BaseLayerProps & {
  /**
   * The type of layer to render.
   */
  type: T;

  /**
   * Customizable style attributes.
   */
  style?: T extends keyof LayerStyleMap ? LayerStyleMap[T] : AllLayerStyle;
};

/**
 * Layer is a style layer that renders geospatial data on the map.
 *
 * This is the unified layer component that supports all layer types.
 * You can also use the specific layer components (FillLayer, LineLayer, etc.)
 * for stricter type checking.
 *
 * @example
 * ```tsx
 * <Layer type="fill" id="parks" source="national-parks" style={{ fillColor: "green" }} />
 * ```
 */
export const Layer = <T extends LayerType>(props: LayerProps<T>) => {
  const { type, style, filter, ...rest } = props;

  const nativeProps = useMemo(
    () => ({
      ...rest,
      layerType: type,
      filter: getFilter(filter),
      reactStyle: transformStyle(style),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  return <LayerNativeComponent testID={`mlrn-${type}-layer`} {...nativeProps} />;
};
