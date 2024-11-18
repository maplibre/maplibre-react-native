import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type HeatmapLayerStyleProps } from "../utils/MaplibreStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "RCTMLNHeatmapLayer";

export interface HeatmapLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyleProps;
}

interface NativeProps
  extends Omit<HeatmapLayerProps, "style">,
    NativeBaseProps {}

const RCTMLNHeatmapLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: HeatmapLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    HeatmapLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <RCTMLNHeatmapLayer ref={setNativeLayer} {...baseProps} />;
};

export default HeatmapLayer;
