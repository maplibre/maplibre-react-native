import React from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

import useAbstractLayer, {
  BaseLayerProps,
  NativeBaseProps,
} from '../hooks/useAbstractLayer';
import BaseProps from '../types/BaseProps';
import {LineLayerStyleProps} from '../utils/MaplibreStyles';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNLineLayer';

export interface LineLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyleProps;
}

interface NativeProps extends Omit<LineLayerProps, 'style'>, NativeBaseProps {}

const RCTMLNLineLayer =
  requireNativeComponent<NativeBaseProps>(NATIVE_MODULE_NAME);

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
const LineLayer: React.FC<LineLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: LineLayerProps) => {
  const {baseProps, setNativeLayer} = useAbstractLayer<
    LineLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <RCTMLNLineLayer ref={setNativeLayer} {...baseProps} />;
};

export default LineLayer;
