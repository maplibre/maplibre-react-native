import { Layer, type BaseLayerProps } from "./Layer";
import { type CircleLayerStyle } from "../../types/MapLibreRNStyles";

export interface CircleLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyle;
}

/**
 * CircleLayer is a style layer that renders one or more filled circles on the map.
 */
export const CircleLayer = (props: CircleLayerProps) => {
  return <Layer {...props} type="circle" />;
};
