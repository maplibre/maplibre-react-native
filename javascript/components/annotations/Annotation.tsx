import SymbolLayer from '../SymbolLayer';
import Animated from '../../utils/animated/Animated';
import AnimatedMapPoint from '../../utils/animated/AnimatedPoint';
import OnPressEvent from '../../types/OnPressEvent';
import {SymbolLayerStyleProps} from '../../utils/MaplibreStyles';

import React, {ReactElement} from 'react';
import {Animated as RNAnimated, Easing} from 'react-native';

interface AnnotationProps {
  id: string;
  animated?: boolean;
  animationDuration?: number;
  animationEasingFunction?(x: number): number;
  coordinates?: number[];
  onPress?(event: OnPressEvent): void;
  children?: ReactElement | ReactElement[];
  style?: object;
  icon?: string | number | object;
}

type AnnotationState = {
  shape: AnimatedMapPoint | GeoJSON.Point | null;
};

class Annotation extends React.Component<AnnotationProps, AnnotationState> {
  static defaultProps = {
    animated: false,
    animationDuration: 1000,
    animationEasingFunction: Easing.linear,
  };

  constructor(props: AnnotationProps) {
    super(props);

    const shape = this._getShapeFromProps(props);

    this.state = {
      shape: props.animated ? new AnimatedMapPoint(shape) : shape,
    };

    this.onPress = this.onPress.bind(this);
  }

  componentDidUpdate(prevProps: AnnotationProps): void {
    if (!Array.isArray(this.props.coordinates)) {
      this.setState({shape: null});
      return;
    }

    const hasCoordChanged =
      prevProps.coordinates?.[0] !== this.props.coordinates?.[0] ||
      prevProps.coordinates?.[1] !== this.props.coordinates?.[1];

    if (!hasCoordChanged) {
      return;
    }

    if (this.props.animated && this.state.shape) {
      // flush current animations
      (this.state.shape as AnimatedMapPoint).stopAnimation();

      (this.state.shape as AnimatedMapPoint)
        .timing({
          coordinates: this.props.coordinates,
          easing: this.props.animationEasingFunction,
          duration: this.props.animationDuration,
        })
        .start();
    } else if (!this.state.shape || !this.props.animated) {
      const shape = this._getShapeFromProps();

      this.setState({
        shape: this.props.animated ? new AnimatedMapPoint(shape) : shape,
      });
    }
  }

  onPress(event: OnPressEvent): void {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }

  _getShapeFromProps(props: Partial<AnnotationProps> = {}): GeoJSON.Point {
    const lng = props.coordinates?.[0] || 0;
    const lat = props.coordinates?.[1] || 0;
    return {type: 'Point', coordinates: [lng, lat]};
  }

  get symbolStyle(): SymbolLayerStyleProps | undefined {
    if (!this.props.icon) {
      return undefined;
    }
    return Object.assign({}, this.props.style, {
      iconImage: this.props.icon,
    });
  }

  render(): ReactElement | null {
    if (!this.props.coordinates) {
      return null;
    }

    const children = [];

    if (this.symbolStyle) {
      children.push(
        <SymbolLayer id={`${this.props.id}-symbol`} style={this.symbolStyle} />,
      );
    }

    if (this.props.children) {
      if (Array.isArray(this.props.children)) {
        children.push(...this.props.children);
      } else {
        children.push(this.props.children);
      }
    }

    return (
      <Animated.ShapeSource
        id={this.props.id}
        onPress={this.onPress}
        shape={
          this.state.shape as RNAnimated.WithAnimatedObject<GeoJSON.Point>
        }>
        {children}
      </Animated.ShapeSource>
    );
  }
}

export default Annotation;
