import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type HeatmapLayerStyle } from "../utils/MapLibreRNStyles";

const MapLibreRN = NativeModules.MLRNModule;

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
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  sourceID = MapLibreRN.StyleSource.DefaultSourceID,
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

export default HeatmapLayer;
