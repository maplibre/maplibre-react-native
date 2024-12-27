import { requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type LightLayerStyle } from "../types/MapLibreRNStyles";
import { type StyleValue } from "../utils/StyleValue";

export const NATIVE_MODULE_NAME = "MLRNLight";

interface LightProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LightLayerStyle;
}

interface NativeProps extends Omit<LightProps, "style"> {
  reactStyle?: { [key: string]: StyleValue };
}

const MLRNLight = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * Light represents the light source for extruded geometries
 */
export const Light = (props: LightProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    LightProps,
    NativeProps
  >({
    ...props,
  });

  return <MLRNLight ref={setNativeLayer} testID="mlrnLight" {...baseProps} />;
};
