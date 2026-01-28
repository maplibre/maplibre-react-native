import { Layer, type BaseLayerProps } from "./Layer";
import { type FillExtrusionLayerStyle } from "../../types/MapLibreRNStyles";

export interface FillExtrusionLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillExtrusionLayerStyle;
}

/**
 * FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.
 */
export const FillExtrusionLayer = (props: FillExtrusionLayerProps) => {
  return <Layer {...props} type="fill-extrusion" />;
};
