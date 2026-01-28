import { Layer, type BaseLayerProps } from "./Layer";
import { type BackgroundLayerStyle } from "../../types/MapLibreRNStyles";

export interface BackgroundLayerProps
  extends Omit<BaseLayerProps, "source" | "sourceLayer" | "filter"> {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyle;
}

/**
 * BackgroundLayer is a style layer that covers the entire map.
 * Use it to configure a color or pattern to show below all other map content.
 */
export const BackgroundLayer = (props: BackgroundLayerProps) => {
  return <Layer {...props} type="background" />;
};
