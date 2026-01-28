import { Layer, type BaseLayerProps } from "./Layer";
import { type LineLayerStyle } from "../../types/MapLibreRNStyles";

export interface LineLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyle;
}

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
export const LineLayer = (props: LineLayerProps) => {
  return <Layer {...props} type="line" />;
};
