import {BackgroundLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactNode} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNBackgroundLayer';

interface BackgroundLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: BackgroundLayerStyleProps;
}

interface NativeProps
  extends Omit<BackgroundLayerProps, 'style'>,
    NativeBaseProps {}

class BackgroundLayer extends AbstractLayer<BackgroundLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactNode {
    return (
      <RCTMLNBackgroundLayer
        testID="rctmlnBackgroundLayer"
        ref={this.setNativeLayer}
        {...this.baseProps}
      />
    );
  }
}

const RCTMLNBackgroundLayer =
  requireNativeComponent<BackgroundLayerProps>(NATIVE_MODULE_NAME);

export default BackgroundLayer;
