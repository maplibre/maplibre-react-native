import SymbolLayer from '../SymbolLayer';
import Animated from '../../utils/animated/Animated';
import AnimatedMapPoint from '../../utils/animated/AnimatedPoint';
import OnPressEvent from '../../types/OnPressEvent';
import {SymbolLayerStyleProps} from '../../utils/MaplibreStyles';

import React, {ReactElement, useCallback, useEffect} from 'react';
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

type Shape = AnimatedMapPoint | GeoJSON.Point;

function getShapeFromProps(props: Partial<AnnotationProps> = {}): Shape {
  const lng = props.coordinates?.[0] || 0;
  const lat = props.coordinates?.[1] || 0;
  const point: GeoJSON.Point = {type: 'Point', coordinates: [lng, lat]};

  if (props.animated) {
    return new AnimatedMapPoint(point);
  }

  return point;
}

function isShapeAnimated(shape: Shape): shape is AnimatedMapPoint {
  return shape instanceof AnimatedMapPoint;
}

const Annotation: React.FC<AnnotationProps> = ({
  animated = false,
  animationDuration = 1000,
  animationEasingFunction = Easing.linear,
  ...otherProps
}) => {
  const props = {
    ...otherProps,
    animated,
    animationDuration,
    animationEasingFunction,
  };

  const [shape, setShape] = React.useState<Shape | null>(
    getShapeFromProps(props),
  );

  // this will run useEffect only when actual coordinates values change
  const coordinateDeps = props.coordinates?.join(',');

  useEffect(() => {
    if (!Array.isArray(props.coordinates)) {
      setShape(null);
      return;
    }

    if (shape && isShapeAnimated(shape)) {
      shape.stopAnimation();

      shape
        .timing({
          coordinates: props.coordinates,
          easing: animationEasingFunction,
          duration: animationDuration,
        })
        .start();

      return;
    }

    if (!shape || !isShapeAnimated(shape)) {
      const newShape = getShapeFromProps(props);
      setShape(newShape);
    }
  }, [coordinateDeps]);

  const onPress = useCallback(
    (event: OnPressEvent) => {
      if (props.onPress) {
        props.onPress(event);
      }
    },
    [props.onPress],
  );

  if (!props.coordinates) {
    return null;
  }

  const children = [];
  const symbolStyle: SymbolLayerStyleProps | undefined = props.icon
    ? {...props.style, iconImage: props.icon}
    : undefined;

  if (symbolStyle) {
    children.push(
      <SymbolLayer id={`${props.id}-symbol`} style={symbolStyle} />,
    );
  }

  if (props.children) {
    if (Array.isArray(props.children)) {
      children.push(...props.children);
    } else {
      children.push(props.children);
    }
  }

  return (
    <Animated.ShapeSource
      id={props.id}
      onPress={onPress}
      shape={shape as RNAnimated.WithAnimatedObject<GeoJSON.Point>}>
      {children}
    </Animated.ShapeSource>
  );
};

export default Annotation;
