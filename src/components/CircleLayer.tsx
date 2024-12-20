import { NativeModules, requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type CircleLayerStyle } from "../types/MapLibreRNStyles";

const MLRNModule = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNCircleLayer";

export interface CircleLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyle;
}

interface NativeProps
  extends Omit<CircleLayerProps, "style">,
    NativeBaseProps {}

const MLRNCircleLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * CircleLayer is a style layer that renders one or more filled circles on the map.
 */
export const CircleLayer = ({
  sourceID = MLRNModule.StyleSource.DefaultSourceID,
  ...props
}: CircleLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    CircleLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return (
    <MLRNCircleLayer
      testID="mlrnCircleLayer"
      ref={setNativeLayer}
      {...baseProps}
    />
  );
};
