/* eslint react/prop-types:0  */
import {StyleValue, transformStyle} from '../utils/StyleValue';
import {getFilter} from '../utils/filterUtils';
import {AllLayerStyleProps, FilterExpression} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

import React from 'react';
import {processColor, NativeMethods} from 'react-native';

export interface BaseLayerProps {
  /**
   * A string that uniquely identifies the source in the style to which it is added.
   */
  id: string;
  /**
   * The source from which to obtain the data to style.
   * If the source has not yet been added to the current style, the behavior is undefined.
   * Inferred from parent source only if the layer is a direct child to it.
   */
  sourceID?: string;
  /**
   * Identifier of the layer within the source identified by the sourceID property from which the receiver obtains the data to style.
   */
  sourceLayerID?: string;
  /**
   * Inserts a layer above aboveLayerID.
   */
  aboveLayerID?: string;
  /**
   * Inserts a layer below belowLayerID
   */
  belowLayerID?: string;
  /**
   * Inserts a layer at a specified index
   */
  layerIndex?: number;
  /**
   *  Filter only the features in the source layer that satisfy a condition that you define
   */
  /**
   * The minimum zoom level at which the layer gets parsed and appears.
   */
  minZoomLevel?: number;
  /**
   * The maximum zoom level at which the layer gets parsed and appears.
   */
  maxZoomLevel?: number;
  filter?: FilterExpression;
  /**
   * Customizable style attributes
   */
  style?: AllLayerStyleProps;
}

export interface NativeBaseProps {
  reactStyle?: {[key: string]: StyleValue};
}

class AbstractLayer<
  Props extends BaseProps,
  NativeProps extends NativeBaseProps,
> extends React.PureComponent<Props & BaseLayerProps> {
  get baseProps(): Props {
    return {
      ...this.props,
      id: this.props.id,
      sourceID: this.props.sourceID,
      reactStyle: this.getStyle(),
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      aboveLayerID: this.props.aboveLayerID,
      belowLayerID: this.props.belowLayerID,
      layerIndex: this.props.layerIndex,
      filter: getFilter(this.props.filter),
      style: undefined,
    };
  }

  nativeLayer: (React.Component<NativeProps> & Readonly<NativeMethods>) | null =
    null;

  setNativeLayer = (
    instance: (React.Component<NativeProps> & Readonly<NativeMethods>) | null,
  ): void => {
    this.nativeLayer = instance;
  };

  getStyleTypeFormatter(styleType: string): typeof processColor | undefined {
    return styleType === 'color' ? processColor : undefined;
  }

  getStyle(): {[key: string]: StyleValue} | undefined {
    return transformStyle(this.props.style);
  }

  setNativeProps(props: {[key: string]: unknown}): void {
    if (this.nativeLayer) {
      let propsToPass = props;
      if (props.style) {
        propsToPass = {...props, reactStyle: this.getStyle()};
      }
      this.nativeLayer.setNativeProps(propsToPass);
    }
  }
}

export default AbstractLayer;
