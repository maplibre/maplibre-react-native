import {LineLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNLineLayer';

interface LineLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: LineLayerStyleProps;
}

interface NativeProps extends Omit<LineLayerProps, 'style'>, NativeBaseProps {}

/**
 * LineLayer is a style layer that renders one or more stroked polylines on the map.
 */
class LineLayer extends AbstractLayer<LineLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactElement {
    const props = {
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID,
    };
    return <RCTMLNLineLayer ref={this.setNativeLayer} {...props} />;
  }
}

const RCTMLNLineLayer =
  requireNativeComponent<NativeBaseProps>(NATIVE_MODULE_NAME);

export default LineLayer;
