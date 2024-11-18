import React from "react";
import { requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type LightLayerStyleProps } from "../utils/MapLibreRNStyles";
import { type StyleValue } from "../utils/StyleValue";

export const NATIVE_MODULE_NAME = "RCTMLNLight";

interface LightProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LightLayerStyleProps;
}

interface NativeProps extends Omit<LightProps, "style"> {
  reactStyle?: { [key: string]: StyleValue };
}

const RCTMLNLight = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * Light represents the light source for extruded geometries
 */
const Light: React.FC<LightProps> = (props: LightProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    LightProps,
    NativeProps
  >({
    ...props,
  });

  return (
    <RCTMLNLight ref={setNativeLayer} testID="rctmlnLight" {...baseProps} />
  );
};

export default Light;
