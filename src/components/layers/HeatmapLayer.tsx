import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
import { type HeatmapLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNHeatmapLayer";

export interface HeatmapLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyle;
}

interface NativeProps
  extends Omit<HeatmapLayerProps, "style">, NativeBaseLayerProps {}

const MLRNHeatmapLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
export const HeatmapLayer = (props: HeatmapLayerProps) => {
  const nativeProps = useNativeLayerProps<HeatmapLayerProps>(props);

  return <MLRNHeatmapLayer testID="mlrn-heatmap-layer" {...nativeProps} />;
};
