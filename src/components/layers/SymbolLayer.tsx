import { Layer, type BaseLayerProps } from "./Layer";
import { type SymbolLayerStyle } from "../../types/MapLibreRNStyles";

export interface SymbolLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: SymbolLayerStyle;
}

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
export const SymbolLayer = (props: SymbolLayerProps) => {
  return <Layer {...props} type="symbol" />;
};
