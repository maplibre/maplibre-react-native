import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type LineLayerStyleProps } from "../utils/MapLibreRNStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "MLRNLineLayer";

export interface LineLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyleProps;
}

interface NativeProps extends Omit<LineLayerProps, "style">, NativeBaseProps {}

const MLRNLineLayer =
  requireNativeComponent<NativeBaseProps>(NATIVE_MODULE_NAME);

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
const LineLayer: React.FC<LineLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: LineLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    LineLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNLineLayer ref={setNativeLayer} {...baseProps} />;
};

export default LineLayer;
