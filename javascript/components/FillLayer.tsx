import React from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

import useAbstractLayer, {
  BaseLayerProps,
  NativeBaseProps,
} from '../hooks/useAbstractLayer';
import BaseProps from '../types/BaseProps';
import {FillLayerStyleProps} from '../utils/MaplibreStyles';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNFillLayer';

export interface FillLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillLayerStyleProps;
}

interface NativeProps extends Omit<FillLayerProps, 'style'>, NativeBaseProps {}

const RCTMLNFillLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
const FillLayer: React.FC<FillLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: FillLayerProps) => {
  const {baseProps, setNativeLayer} = useAbstractLayer<
    FillLayerProps,
    NativeProps
  >({
    ...props,
    sourceID,
  });

  return <RCTMLNFillLayer ref={setNativeLayer} {...baseProps} />;
};

export default FillLayer;
