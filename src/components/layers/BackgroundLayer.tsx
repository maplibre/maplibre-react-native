import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useLayerProps,
} from "../../hooks/useLayerProps";
import { type BackgroundLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNBackgroundLayer";

export interface BackgroundLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyle;
}

interface NativeProps
  extends Omit<BackgroundLayerProps, "style">, NativeBaseLayerProps {}

const MLRNBackgroundLayer =
  requireNativeComponent<BackgroundLayerProps>(NATIVE_MODULE_NAME);

export const BackgroundLayer = (props: BackgroundLayerProps) => {
  const { nativeRef, nativeProps } = useLayerProps<
    BackgroundLayerProps,
    NativeProps
  >(props);

  return (
    <MLRNBackgroundLayer
      testID="mlrn-background-layer"
      ref={nativeRef}
      {...nativeProps}
    />
  );
};
