import { Layer, type BaseLayerProps } from "./Layer";
import { type FillLayerStyle } from "../../types/MapLibreRNStyles";

export interface FillLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillLayerStyle;
}

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
export const FillLayer = (props: FillLayerProps) => {
  return <Layer {...props} type="fill" />;
};
