import { requireNativeComponent } from "react-native";

import { StyleSource } from "../../constants";
import {
  type BaseLayerProps,
  type NativeBaseProps,
  useAbstractLayer,
} from "../../hooks/useAbstractLayer";
import { type BaseProps } from "../../types/BaseProps";
import { type HeatmapLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNHeatmapLayer";

export interface HeatmapLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyle;
}

interface NativeProps
  extends Omit<HeatmapLayerProps, "style">,
    NativeBaseProps {}

const MLRNHeatmapLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
export const HeatmapLayer = ({
  sourceID = StyleSource.DefaultSourceID,
  ...props
}: HeatmapLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    HeatmapLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNHeatmapLayer ref={setNativeLayer} {...baseProps} />;
};
