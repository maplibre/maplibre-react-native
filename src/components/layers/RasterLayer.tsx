import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useLayerProps,
} from "../../hooks/useLayerProps";
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
  const { nativeRef, nativeProps } = useLayerProps<
    RasterLayerProps,
    NativeProps
  >(props);

  return (
    <MLRNRasterLayer
      testID="mlrn-raster-layer"
      ref={nativeRef}
      {...nativeProps}
    />
  );
};
