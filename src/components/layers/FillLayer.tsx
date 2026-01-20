import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useNativeLayerProps,
} from "../../hooks/useNativeLayerProps";
import { type FillLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNFillLayer";

export interface FillLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillLayerStyle;
}

interface NativeProps
  extends Omit<FillLayerProps, "style">, NativeBaseLayerProps {}

const MLRNFillLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
export const FillLayer = (props: FillLayerProps) => {
  const nativeProps = useNativeLayerProps<FillLayerProps>(props);

  return <MLRNFillLayer testID="mlrn-fill-layer" {...nativeProps} />;
};
