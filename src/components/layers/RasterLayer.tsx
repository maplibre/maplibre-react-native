import { requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../../hooks/useAbstractLayer";
import { type BaseProps } from "../../types/BaseProps";
import { type RasterLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNRasterLayer";

export interface RasterLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: RasterLayerStyle;
}

interface NativeProps
  extends Omit<RasterLayerProps, "style">, NativeBaseProps {}

const MLRNRasterLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export const RasterLayer = (props: RasterLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    RasterLayerProps,
    NativeProps
  >(props);

  return <MLRNRasterLayer ref={setNativeLayer} {...baseProps} />;
};
