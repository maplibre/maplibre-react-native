import React from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

import {HeatmapLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';
import useAbstractLayer, {
  BaseLayerProps,
  NativeBaseProps,
} from '../hooks/useAbstractLayer';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNHeatmapLayer';

export interface HeatmapLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyleProps;
}

interface NativeProps
  extends Omit<HeatmapLayerProps, 'style'>,
    NativeBaseProps {}

const RCTMLNHeatmapLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);
/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: HeatmapLayerProps) => {
  const {baseProps, setNativeLayer} = useAbstractLayer<
    HeatmapLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <RCTMLNHeatmapLayer ref={setNativeLayer} {...baseProps} />;
};

export default HeatmapLayer;
