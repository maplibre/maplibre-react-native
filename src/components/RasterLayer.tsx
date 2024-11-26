import React from "react";
import { NativeModules, requireNativeComponent } from "react-native";

import useAbstractLayer, {
  type BaseLayerProps,
  type NativeBaseProps,
} from "../hooks/useAbstractLayer";
import { type BaseProps } from "../types/BaseProps";
import { type RasterLayerStyleProps } from "../utils/MapLibreRNStyles";

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = "MLRNRasterLayer";

export interface RasterLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: RasterLayerStyleProps;
}

interface NativeProps
  extends Omit<RasterLayerProps, "style">,
    NativeBaseProps {}

const MLRNRasterLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

const RasterLayer: React.FC<RasterLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: RasterLayerProps) => {
  const { baseProps, setNativeLayer } = useAbstractLayer<
    RasterLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <MLRNRasterLayer ref={setNativeLayer} {...baseProps} />;
};

export default RasterLayer;
