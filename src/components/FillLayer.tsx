import { NativeModules, requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type FillLayerStyle } from "../types/MapLibreRNStyles";

const MLRNModule = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNFillLayer";

export interface FillLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillLayerStyle;
}

interface NativeProps extends Omit<FillLayerProps, "style">, NativeBaseProps {}

const MLRNFillLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
export const FillLayer = ({
  sourceID = MLRNModule.StyleSource.DefaultSourceID,
  ...props
}: FillLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    FillLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNFillLayer ref={setNativeLayer} {...baseProps} />;
};
