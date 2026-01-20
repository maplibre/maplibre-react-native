import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
import { type CircleLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNCircleLayer";

export interface CircleLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyle;
}

interface NativeProps
  extends Omit<CircleLayerProps, "style">, NativeBaseLayerProps {}

const MLRNCircleLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * CircleLayer is a style layer that renders one or more filled circles on the map.
 */
export const CircleLayer = (props: CircleLayerProps) => {
  const nativeProps = useNativeLayerProps<CircleLayerProps>(props);

  return <MLRNCircleLayer testID="mlrn-circle-layer" {...nativeProps} />;
};
