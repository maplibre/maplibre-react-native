import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
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
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export const BackgroundLayer = (props: BackgroundLayerProps) => {
  const nativeProps = useNativeLayerProps<BackgroundLayerProps>(props);

  return (
    <MLRNBackgroundLayer testID="mlrn-background-layer" {...nativeProps} />
  );
};
