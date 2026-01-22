import { requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../../hooks/useAbstractLayer";
import { type BaseProps } from "../../types/BaseProps";
import { type SymbolLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNSymbolLayer";

export interface SymbolLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: SymbolLayerStyle;
}

interface NativeProps
  extends Omit<SymbolLayerProps, "style">, NativeBaseProps {}

const MLRNSymbolLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
export const SymbolLayer = (props: SymbolLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    SymbolLayerProps,
    NativeBaseProps
  >(props);

  const updatedProps = {
    ...baseProps,
  };

  return <MLRNSymbolLayer ref={setNativeLayer} {...updatedProps} />;
};
