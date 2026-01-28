import { Layer, type BaseLayerProps } from "./Layer";
import { type RasterLayerStyle } from "../../types/MapLibreRNStyles";

export interface RasterLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: RasterLayerStyle;
}

/**
 * RasterLayer is a style layer that renders raster tiles on the map.
 */
export const RasterLayer = (props: RasterLayerProps) => {
  return <Layer {...props} type="raster" />;
};
