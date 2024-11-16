import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  BaseLayerProps,
  NativeBaseProps,
} from "../hooks/useAbstractLayer";
import BaseProps from "../types/BaseProps";
import { CircleLayerStyleProps } from "../utils/MaplibreStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "RCTMLNCircleLayer";

export interface CircleLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyleProps;
}

interface NativeProps
  extends Omit<CircleLayerProps, "style">,
    NativeBaseProps {}

const RCTMLNCircleLayer =
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
    <RCTMLNCircleLayer
      testID="rctmlnCircleLayer"
      ref={setNativeLayer}
      {...baseProps}
    />
  );
};

export default CircleLayer;
