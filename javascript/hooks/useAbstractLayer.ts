import React, {useMemo, useRef} from 'react';
import {processColor, NativeMethods} from 'react-native';

import {StyleValue, transformStyle} from '../utils/StyleValue';
import {getFilter} from '../utils/filterUtils';
import {
  AllLayerStyleProps,
  ExpressionField,
  ExpressionName,
  FilterExpression,
} from '../utils/MaplibreStyles';
import BaseProps from '../types/BaseProps';

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

export default function useAbstractLayer<
  Props extends BaseProps,
  NativeProps extends NativeBaseProps,
>(
  props: Props & BaseLayerProps,
): {
  baseProps: Props & BaseLayerProps;
  setNativeLayer: (
    instance: (React.Component<NativeProps> & Readonly<NativeMethods>) | null,
  ) => void;
  getStyleTypeFormatter: (styleType: string) => typeof processColor | undefined;
  setNativeProps: (nativeProps: {[key: string]: unknown}) => void;
} {
  const nativeLayer = useRef<
    (React.Component<NativeProps> & Readonly<NativeMethods>) | null
  >(null);

  const baseProps = useMemo(() => {
    return {
      ...props,
      id: props.id,
      sourceID: props.sourceID,
      reactStyle: transformStyle(props.style),
      minZoomLevel: props.minZoomLevel,
      maxZoomLevel: props.maxZoomLevel,
      aboveLayerID: props.aboveLayerID,
      belowLayerID: props.belowLayerID,
      layerIndex: props.layerIndex,
      filter: getFilter(props.filter) as [ExpressionName, ...ExpressionField[]],
      style: undefined,
    };
  }, [props]);

  const setNativeLayer = (
    instance: (React.Component<NativeProps> & Readonly<NativeMethods>) | null,
  ): void => {
    nativeLayer.current = instance;
  };

  const getStyleTypeFormatter = (
    styleType: string,
  ): typeof processColor | undefined => {
    return styleType === 'color' ? processColor : undefined;
  };

  const setNativeProps = (nativeProps: {[key: string]: unknown}): void => {
    if (nativeLayer.current) {
      let propsToPass = nativeProps;
      if (nativeProps.style) {
        propsToPass = {...nativeProps, reactStyle: transformStyle(props.style)};
      }
      nativeLayer.current.setNativeProps(propsToPass);
    }
  };

  return {
    baseProps,
    setNativeLayer,
    getStyleTypeFormatter,
    setNativeProps,
  };
}
