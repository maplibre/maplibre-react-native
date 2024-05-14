import {type SymbolLayerStyleProps} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import AbstractLayer, {BaseLayerProps, NativeBaseProps} from './AbstractLayer';

import React, {ReactElement} from 'react';
import {View, NativeModules, requireNativeComponent} from 'react-native';

const MapLibreGL = NativeModules.MLNModule;

export const NATIVE_MODULE_NAME = 'RCTMLNSymbolLayer';

interface SymbolLayerProps extends BaseProps, BaseLayerProps {
  /**
   * Customizable style attributes
   */
  style?: SymbolLayerStyleProps;

  /**
   * @deprecated passed children used to create an image with id of symbol in style and also set the iconImageName property accordingly.
   * This is now deprecated, use Image component instead.
   */
  children?: ReactElement | ReactElement[];
}

interface NativeProps extends Omit<SymbolLayerProps, 'style'>, NativeBaseProps {
  snapshot: boolean;
}

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
class SymbolLayer extends AbstractLayer<SymbolLayerProps, NativeBaseProps> {
  static defaultProps = {
    sourceID: MapLibreGL.StyleSource.DefaultSourceID,
  };

  _shouldSnapshot(): boolean {
    let isSnapshot = false;

    if (React.Children.count(this.props.children) <= 0) {
      return isSnapshot;
    }

    React.Children.forEach(this.props.children, child => {
      if (child?.type === View) {
        isSnapshot = true;
      }
    });

    return isSnapshot;
  }

  render(): ReactElement {
    const props = {
      ...this.baseProps,
      snapshot: this._shouldSnapshot(),
      sourceLayerID: this.props.sourceLayerID,
    };

    return (
      <RCTMLNSymbolLayer ref={this.setNativeLayer} {...props}>
        {this.props.children}
      </RCTMLNSymbolLayer>
    );
  }
}

const RCTMLNSymbolLayer =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default SymbolLayer;
