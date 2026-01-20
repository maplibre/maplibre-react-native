import { requireNativeComponent } from "react-native";

import {
  type BaseLayerProps,
  type NativeBaseLayerProps,
  useLayerProps,
} from "../../hooks/useLayerProps";
import { type FillExtrusionLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNFillExtrusionLayer";

export interface FillExtrusionLayerProps extends BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillExtrusionLayerStyle;
}

interface NativeProps
  extends Omit<FillExtrusionLayerProps, "style">, NativeBaseLayerProps {}

const MLRNFillExtrusionLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.
 */
export const FillExtrusionLayer = (props: FillExtrusionLayerProps) => {
  const { nativeRef, nativeProps } = useLayerProps<
    FillExtrusionLayerProps,
    NativeProps
  >(props);

  return (
    <MLRNFillExtrusionLayer
      testID="mlrn-fill-extrusion-layer"
      ref={nativeRef}
      {...nativeProps}
    />
  );
};
