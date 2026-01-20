import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
import { type SymbolLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNSymbolLayer";

export interface SymbolLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: SymbolLayerStyle;
}

interface NativeProps
  extends Omit<SymbolLayerProps, "style">, NativeBaseLayerProps {}

const MLRNSymbolLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
export const SymbolLayer = (props: SymbolLayerProps) => {
  const nativeProps = useNativeLayerProps<SymbolLayerProps>(props);

  return <MLRNSymbolLayer testID="mlrn-symbol-layer" {...nativeProps} />;
};
