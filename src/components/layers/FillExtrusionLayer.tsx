import { requireNativeComponent } from "react-native";

import { StyleSource } from "../../constants";
import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../../hooks/useAbstractLayer";
import { type BaseProps } from "../../types/BaseProps";
import { type FillExtrusionLayerStyle } from "../../types/MapLibreRNStyles";

export const NATIVE_MODULE_NAME = "MLRNFillExtrusionLayer";

export interface FillExtrusionLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillExtrusionLayerStyle;
}

interface NativeProps
  extends Omit<FillExtrusionLayerProps, "style">, NativeBaseProps {}

const MLRNFillExtrusionLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.
 */
export const FillExtrusionLayer = ({
  sourceID = StyleSource.DefaultSourceID,
  ...props
}: FillExtrusionLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    FillExtrusionLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNFillExtrusionLayer ref={setNativeLayer} {...baseProps} />;
};
