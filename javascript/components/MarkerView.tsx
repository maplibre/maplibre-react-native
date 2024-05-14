import {toJSONString} from '../utils';
import {makePoint} from '../utils/geoUtils';

import PointAnnotation from './PointAnnotation';

import React, {ReactElement} from 'react';
import {Platform, requireNativeComponent, ViewProps} from 'react-native';

export const NATIVE_MODULE_NAME = 'RCTMLNMarkerView';

interface MarkerViewProps extends ViewProps {
  /**
   * The center point (specified as a map coordinate) of the marker.
   * See also #anchor.
   */
  coordinate: number[];
  /**
   * Specifies the anchor being set on a particular point of the annotation.
   * The anchor point is specified in the continuous space [0.0, 1.0] x [0.0, 1.0],
   * where (0, 0) is the top-left corner of the image, and (1, 1) is the bottom-right corner.
   * Note this is only for custom annotations not the default pin view.
   * Defaults to the center of the view.
   */
  anchor: {
    /**
     * `x` of anchor
     */
    x: number;
    /**
     * `y` of anchor
     */
    y: number;
  };
  allowOverlap: boolean;
  isSelected: boolean;
  /**
   * Expects one child - can be container with multiple elements
   */
  children: React.ReactElement;
}

interface NativeProps extends ViewProps {
  coordinate: string | undefined;
  anchor: {x: number; y: number};
  allowOverlap: boolean;
  isSelected: boolean;
}

/**
 * MarkerView allows you to place a interactive react native marker to the map.
 *
 * If you have static view consider using PointAnnotation or SymbolLayer they'll offer much better performance
 * .
 * This is based on [MakerView plugin](https://docs.mapbox.com/android/plugins/overview/markerview/) on Android
 * and PointAnnotation on iOS.
 */
class MarkerView extends React.PureComponent<MarkerViewProps> {
  static defaultProps = {
    anchor: {x: 0.5, y: 0.5},
    allowOverlap: false,
    isSelected: false,
  };

  static lastId = 0;
  __idForPointAnnotation?: string;

  _idForPointAnnotation(): string {
    if (this.__idForPointAnnotation === undefined) {
      MarkerView.lastId = MarkerView.lastId + 1;
      this.__idForPointAnnotation = `MV-${MarkerView.lastId}`;
    }
    return this.__idForPointAnnotation;
  }

  _getCoordinate(): string | undefined {
    if (!this.props.coordinate) {
      return undefined;
    }
    return toJSONString(makePoint(this.props.coordinate));
  }

  render(): ReactElement {
    if (Platform.OS === 'ios') {
      return (
        <PointAnnotation id={this._idForPointAnnotation()} {...this.props} />
      );
    }

    const props = {
      ...this.props,
      anchor: this.props.anchor,
      coordinate: this._getCoordinate(),
    };

    return (
      <RCTMLNMarkerView {...props}>{this.props.children}</RCTMLNMarkerView>
    );
  }
}

const RCTMLNMarkerView =
  requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default MarkerView;
