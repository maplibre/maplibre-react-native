import { Layer, type BaseLayerProps } from "./Layer";
import { type HeatmapLayerStyle } from "../../types/MapLibreRNStyles";

export interface HeatmapLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyle;
}

/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
export const HeatmapLayer = (props: HeatmapLayerProps) => {
  return <Layer {...props} type="heatmap" />;
};
