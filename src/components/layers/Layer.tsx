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

/**
 * Additional props specific to maplibre-react-native.
 */
interface BaseLayerProps extends BaseProps {
  /**
   * The layer will appear under this layer ID.
   */
  beforeId?: string;

  /**
   * The layer will appear above this layer ID.
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
 * Base layer props from style spec with optional id/source.
 * Matches react-map-gl's LayerProps pattern.
 */
type StyleSpecLayerProps = OptionalSource<OptionalId<LayerSpecification>> &
  BaseLayerProps & { style?: never };

/**
 * Common props shared by all layer types.
 *
 * @deprecated Use `paint` and `layout` props instead of `style`. Will be removed in v12.
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
 * @deprecated Use LayerProps instead.
 */
export interface SourceLayerProps extends LegacyBaseLayerProps {
  source?: string;
  "source-layer"?: string;
  filter?: FilterSpecification;
}

// ============================================================================
// DEPRECATED: Legacy type exports for backwards compatibility
// These will be removed in v12. Use LayerProps with paint/layout instead.
// ============================================================================

/**
 * @deprecated Use LayerProps with type="background" instead.
 */
export type BackgroundLayerProps = LegacyBaseLayerProps & {
  type: "background";
  /** @deprecated Use paint and layout props instead */
  style?: BackgroundLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="fill" instead.
 */
export type FillLayerProps = SourceLayerProps & {
  type: "fill";
  /** @deprecated Use paint and layout props instead */
  style?: FillLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="line" instead.
 */
export type LineLayerProps = SourceLayerProps & {
  type: "line";
  /** @deprecated Use paint and layout props instead */
  style?: LineLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="symbol" instead.
 */
export type SymbolLayerProps = SourceLayerProps & {
  type: "symbol";
  /** @deprecated Use paint and layout props instead */
  style?: SymbolLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="circle" instead.
 */
export type CircleLayerProps = SourceLayerProps & {
  type: "circle";
  /** @deprecated Use paint and layout props instead */
  style?: CircleLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="heatmap" instead.
 */
export type HeatmapLayerProps = SourceLayerProps & {
  type: "heatmap";
  /** @deprecated Use paint and layout props instead */
  style?: HeatmapLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="fill-extrusion" instead.
 */
export type FillExtrusionLayerProps = SourceLayerProps & {
  type: "fill-extrusion";
  /** @deprecated Use paint and layout props instead */
  style?: FillExtrusionLayerStyle;
};

/**
 * @deprecated Use LayerProps with type="raster" instead.
 */
export type RasterLayerProps = SourceLayerProps & {
  type: "raster";
  /** @deprecated Use paint and layout props instead */
  style?: RasterLayerStyle;
};

/**
 * Layer component props.
 * Combines style spec LayerSpecification with MLRN-specific props.
 *
 * The `paint` and `layout` props come directly from LayerSpecification
 * and use kebab-case property names per the MapLibre Style Spec.
 *
 * @example
 * ```tsx
 * // Style spec compliant (recommended)
 * <Layer
 *   type="fill"
 *   id="parks"
 *   source="parks-source"
 *   paint={{ "fill-color": "green", "fill-opacity": 0.5 }}
 *   layout={{ "visibility": "visible" }}
 * />
 *
 * // Deprecated (still works)
 * <Layer
 *   type="fill"
 *   id="parks"
 *   source="parks-source"
 *   style={{ fillColor: "green", fillOpacity: 0.5 }}
 * />
 * ```
 */
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
 *
 * // Deprecated style prop (still works but will be removed in v12)
 * <Layer
 *   type="fill"
 *   id="parks"
 *   source="parks-source"
 *   style={{ fillColor: "green", fillOpacity: 0.5 }}
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

    // Warn if using deprecated style prop (only in development)
    if (__DEV__ && style) {
      if (paint || layout) {
        console.warn(
          "@maplibre/maplibre-react-native: Using both `style` and `paint`/`layout` props. " +
            "The `style` prop is deprecated and will be removed in v12. " +
            "Properties from `paint`/`layout` take precedence.",
        );
      } else {
        console.warn(
          "@maplibre/maplibre-react-native: The `style` prop is deprecated. " +
            "Use `paint` and `layout` props instead. Will be removed in v12.",
        );
      }
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
