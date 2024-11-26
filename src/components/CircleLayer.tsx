import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type CircleLayerStyleProps } from "../utils/MapLibreRNStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "MLRNCircleLayer";

export interface CircleLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyleProps;
}

interface NativeProps
  extends Omit<CircleLayerProps, "style">,
    NativeBaseProps {}

const MLRNCircleLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * CircleLayer is a style layer that renders one or more filled circles on the map.
 */
const CircleLayer: React.FC<CircleLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: CircleLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    CircleLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return (
    <MLRNCircleLayer
      testID="mlrnCircleLayer"
      ref={setNativeLayer}
      {...baseProps}
    />
  );
};

export default CircleLayer;
