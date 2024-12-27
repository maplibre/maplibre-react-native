import { NativeModules, requireNativeComponent } from "react-native";

import {
  useAbstractLayer,
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type BackgroundLayerStyle } from "../types/MapLibreRNStyles";

const MLRNModule = NativeModules.MLRNModule;

export const NATIVE_MODULE_NAME = "MLRNBackgroundLayer";

export interface BackgroundLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyle;
}

interface NativeProps
  extends Omit<BackgroundLayerProps, "style">,
    NativeBaseProps {}

const MLRNBackgroundLayer =
  requireNativeComponent<BackgroundLayerProps>(NATIVE_MODULE_NAME);

export const BackgroundLayer = ({
  sourceID = MLRNModule.StyleSource.DefaultSourceID,
  ...props
}: BackgroundLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    BackgroundLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return (
    <MLRNBackgroundLayer
      testID="mlrnBackgroundLayer"
      ref={setNativeLayer}
      {...baseProps}
    />
  );
};
