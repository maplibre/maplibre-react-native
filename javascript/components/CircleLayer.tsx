import {CircleLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MGLModule;

export const NATIVE_MODULE_NAME = 'RCTMGLCircleLayer';

interface CircleLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: CircleLayerStyleProps;
}

interface NativeProps
  extends Omit<CircleLayerProps, 'style'>,
    NativeBaseProps {}

/**
 * CircleLayer is a style layer that renders one or more filled circles on the map.
 */
class CircleLayer extends AbstractLayer<CircleLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactElement {
    return (
      <RCTMGLCircleLayer
        testID="rctmglCircleLayer"
        ref={this.setNativeLayer}
        {...this.baseProps}
      />
    );
  }
}

const RCTMGLCircleLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default CircleLayer;
