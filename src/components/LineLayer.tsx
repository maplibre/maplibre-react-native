import { NativeModules, requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type LineLayerStyle } from "../types/MapLibreRNStyles";

const MLRNModule = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNLineLayer";

export interface LineLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyle;
}

interface NativeProps extends Omit<LineLayerProps, "style">, NativeBaseProps {}

const MLRNLineLayer =
  requireNativeComponent<NativeBaseProps>(NATIVE_MODULE_NAME);

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
export const LineLayer = ({
  sourceID = MLRNModule.StyleSource.DefaultSourceID,
  ...props
}: LineLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    LineLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNLineLayer ref={setNativeLayer} {...baseProps} />;
};
