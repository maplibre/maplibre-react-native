import React from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

import {BackgroundLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';
import useAbstractLayer, {
  BaseLayerProps,
  NativeBaseProps,
} from '../hooks/useAbstractLayer';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNBackgroundLayer';

export interface BackgroundLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyleProps;
}

interface NativeProps
  extends Omit<BackgroundLayerProps, 'style'>,
    NativeBaseProps {}

const RCTMLNBackgroundLayer =
  requireNativeComponent<BackgroundLayerProps>(NATIVE_MODULE_NAME);

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  sourceID = MapLibreGL.StyleSource.DefaultSourceID,
  ...props
}: BackgroundLayerProps) => {
  const {baseProps, setNativeLayer} = useAbstractLayer<
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
