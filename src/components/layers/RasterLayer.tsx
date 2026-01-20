import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
import { type RasterLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNRasterLayer";

export interface RasterLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: RasterLayerStyle;
}

interface NativeProps
  extends Omit<RasterLayerProps, "style">, NativeBaseLayerProps {}

const MLRNRasterLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export const RasterLayer = (props: RasterLayerProps) => {
  const nativeProps = useNativeLayerProps<RasterLayerProps>(props);

  return <MLRNRasterLayer testID="mlrn-raster-layer" {...nativeProps} />;
};
