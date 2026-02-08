import type {
  FilterSpecification,
  LayerSpecification,
} from "@maplibre/maplibre-gl-style-spec";
import { useMemo } from "react";

import LayerNativeComponent from "./LayerNativeComponent";
import { useFrozenId } from "../../hooks/useFrozenId";
import { type BaseProps } from "../../types/BaseProps";
import {
  type BackgroundLayerStyle,
  type CircleLayerStyle,
  type FillExtrusionLayerStyle,
  type FillLayerStyle,
  type HeatmapLayerStyle,
  type LineLayerStyle,
  type RasterLayerStyle,
  type SymbolLayerStyle,
} from "../../types/MapLibreRNStyles";
import { transformStyle } from "../../utils/StyleValue";
import { mergeStyleProps } from "../../utils/convertStyleSpec";
import { getNativeFilter } from "../../utils/getNativeFilter";

let deprecationWarned = false;

/**
 * Additional props specific to @maplibre/maplibre-react-native.
 */
interface BaseLayerProps extends BaseProps {
  /**
   * The layer will appear under this layer.
   */
  beforeId?: string;

  /**
   * The layer will appear above this layer.
   */
  afterId?: string;

  /**
   * Inserts the layer at the specified index.
   */
  layerIndex?: number;
}

// Utility types following react-map-gl pattern
// See: https://github.com/microsoft/TypeScript/issues/39556#issuecomment-656925230
type OptionalId<T> = T extends { id: string }
  ? Omit<T, "id"> & { id?: string }
  : T;
type OptionalSource<T> = T extends { source: string }
  ? Omit<T, "source"> & { source?: string }
  : T;

/**
 * Base layer props from style spec with optional `id`/`source`.
 */
type StyleSpecLayerProps = OptionalSource<OptionalId<LayerSpecification>> &
  BaseLayerProps & {
    /** @deprecated Use `layout`/`paint` props instead. */
    style?: never;
  };

/**
 * Common props shared by all layer types.
 *
 * @deprecated Use `paint` and `layout` props instead of `style`. The `style` prop be removed in v12.
 */
interface LegacyBaseLayerProps extends BaseLayerProps {
  /**
   * A string that uniquely identifies the layer in the style.
   */
  id?: string;

  /**
   * The minimum zoom at which the layer gets parsed and appears.
   */
  minzoom?: number;

  /**
   * The maximum zoom at which the layer gets parsed and appears.
   */
  maxzoom?: number;

  paint?: never;

  layout?: never;
}

/**
 * @deprecated Use `LayerProps` instead.
 */
export interface SourceLayerProps extends LegacyBaseLayerProps {
  source?: string;
  "source-layer"?: string;
  filter?: FilterSpecification;
}

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type BackgroundLayerProps = LegacyBaseLayerProps & {
  type: "background";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: BackgroundLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type FillLayerProps = SourceLayerProps & {
  type: "fill";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: FillLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type LineLayerProps = SourceLayerProps & {
  type: "line";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: LineLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type SymbolLayerProps = SourceLayerProps & {
  type: "symbol";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: SymbolLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type CircleLayerProps = SourceLayerProps & {
  type: "circle";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: CircleLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type HeatmapLayerProps = SourceLayerProps & {
  type: "heatmap";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: HeatmapLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type FillExtrusionLayerProps = SourceLayerProps & {
  type: "fill-extrusion";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: FillExtrusionLayerStyle;
};

/**
 * @deprecated Use `layout`/`paint` instead of `style` prop.
 */
export type RasterLayerProps = SourceLayerProps & {
  type: "raster";
  /** @deprecated Use `layout`/`paint` props instead. */
  style?: RasterLayerStyle;
};

export type LayerProps =
  | StyleSpecLayerProps
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
 * Use the style-spec compliant `paint` and `layout` props with kebab-case keys.
 *
 * @example
 * ```tsx
 * // Style spec compliant (recommended)
 * <Layer
 *   type="fill"
 *   id="parks"
 *   source="parks-source"
 *   paint={{ "fill-color": "green", "fill-opacity": 0.5 }}
 *   layout={{ visibility: "visible" }}
 * />
 *
 * // With expressions
 * <Layer
 *   type="fill"
 *   id="parks"
 *   source="parks-source"
 *   paint={{
 *     "fill-color": ["interpolate", ["linear"], ["get", "elevation"], 0, "blue", 100, "red"],
 *   }}
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
      paint,
      layout,
      beforeId,
      afterId,
      layerIndex,
      ...rest
    } = {
      "source-layer": undefined,
      filter: undefined,
      paint: undefined,
      layout: undefined,
      ...props,
    };

    if (__DEV__ && style && !deprecationWarned) {
      deprecationWarned = true;

      console.warn(
        "[@maplibre/maplibre-react-native] The `style` prop is deprecated. " +
          "Use `paint` and `layout` props instead. `style` will be removed in v12.",
      );
    }

    // Merge paint/layout (new API) with style (deprecated API)
    const mergedStyle = mergeStyleProps(
      paint as Record<string, unknown> | undefined,
      layout as Record<string, unknown> | undefined,
      style,
    );

    return {
      ...rest,
      layerType,
      sourceLayer,
      beforeId,
      afterId,
      layerIndex,
      filter: getNativeFilter(filter as FilterSpecification),
      reactStyle: transformStyle(mergedStyle),
    };
  }, [props]);

  return (
    <LayerNativeComponent
      id={frozenId}
      testID={`mlrn-${props.type}-layer`}
      {...nativeProps}
    />
  );
};
