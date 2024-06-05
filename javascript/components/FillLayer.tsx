import {FillLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNFillLayer';

interface FillLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: FillLayerStyleProps;
}

interface NativeProps extends Omit<FillLayerProps, 'style'>, NativeBaseProps {}

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
class FillLayer extends AbstractLayer<FillLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactElement {
    const props = {
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID,
    };
    return <RCTMLNFillLayer ref={this.setNativeLayer} {...props} />;
  }
}

const RCTMLNFillLayer = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default FillLayer;
