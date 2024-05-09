import {HeatmapLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNHeatmapLayer';

interface HeatmapLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: HeatmapLayerStyleProps;
}

interface NativeProps
  extends Omit<HeatmapLayerProps, 'style'>,
    NativeBaseProps {}

/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
class HeatmapLayer extends AbstractLayer<HeatmapLayerProps, NativeProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  render(): ReactElement {
    const props = {
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID,
    };
    return <RCTMLNHeatmapLayer ref={this.setNativeLayer} {...props} />;
  }
}

const RCTMLNHeatmapLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default HeatmapLayer;
