import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useLayerProps,
} from "../../hooks/useLayerProps";
import { type LineLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNLineLayer";

export interface LineLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyle;
}

interface NativeProps
  extends Omit<LineLayerProps, "style">, NativeBaseLayerProps {}

const MLRNLineLayer =
  requireNativeComponent<NativeBaseLayerProps>(NATIVE_MODULE_NAME);

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
export const LineLayer = (props: LineLayerProps) => {
  const { nativeRef, nativeProps } = useLayerProps<LineLayerProps, NativeProps>(
    props,
  );

  return (
    <MLRNLineLayer testID="mlrn-line-layer" ref={nativeRef} {...nativeProps} />
  );
};
