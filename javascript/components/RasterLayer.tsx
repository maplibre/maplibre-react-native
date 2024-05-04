import {RasterLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNRasterLayer';

interface RasterLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: RasterLayerStyleProps;
}

interface NativeProps
  extends Omit<RasterLayerProps, 'style'>,
    NativeBaseProps {}

class RasterLayer extends AbstractLayer<RasterLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactElement {
    const props = {
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID,
    };
    return <RCTMLNRasterLayer ref={this.setNativeLayer} {...props} />;
  }
}

const RCTMLNRasterLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default RasterLayer;
