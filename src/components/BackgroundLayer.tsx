import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type BackgroundLayerStyleProps } from "../utils/MapLibreRNStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "RCTMLNBackgroundLayer";

export interface BackgroundLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyleProps;
}

interface NativeProps
  extends Omit<BackgroundLayerProps, "style">,
    NativeBaseProps {}

const RCTMLNBackgroundLayer =
  requireNativeComponent<BackgroundLayerProps>(NATIVE_MODULE_NAME);

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
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
    <RCTMLNBackgroundLayer
      testID="rctmlnBackgroundLayer"
      ref={setNativeLayer}
      {...baseProps}
    />
  );
};

export default BackgroundLayer;
