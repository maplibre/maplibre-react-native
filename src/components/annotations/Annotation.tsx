import {
  forwardRef,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Animated as RNAnimated,
  Easing,
  type NativeSyntheticEvent,
} from "react-native";

import type { BaseProps } from "../../types/BaseProps";
import { type SymbolLayerStyle } from "../../types/MapLibreRNStyles";
import type { PressEventWithFeatures } from "../../types/PressEventWithFeatures";
import { Animated } from "../../utils/animated/Animated";
import { AnimatedPoint } from "../../utils/animated/AnimatedPoint";
import { Layer } from "../layers/Layer";

interface AnnotationProps extends BaseProps {
  id: string;
  animated?: boolean;
  animationDuration?: number;
  animationEasingFunction?: (x: number) => number;
  coordinates?: number[];
  onPress?: (event: NativeSyntheticEvent<PressEventWithFeatures>) => void;
  children?: ReactNode;
  style?: SymbolLayerStyle;
  icon?: string | number | object;
}

type Shape = AnimatedPoint | GeoJSON.Point;

function getShapeFromProps(props: Partial<AnnotationProps> = {}): Shape {
  const lng = props.coordinates?.[0] || 0;
  const lat = props.coordinates?.[1] || 0;
  const point: GeoJSON.Point = { type: "Point", coordinates: [lng, lat] };

  if (props.animated) {
    return new AnimatedPoint(point);
  }

  return point;
}

function isShapeAnimated(shape: Shape): shape is AnimatedPoint {
  return shape instanceof AnimatedPoint;
}

interface AnnotationRef {
  symbolStyle: SymbolLayerStyle | undefined;
}

export const Annotation = forwardRef<AnnotationRef, AnnotationProps>(
  (
    {
      animated = false,
      animationDuration = 1000,
      animationEasingFunction = Easing.linear,
      ...otherProps
    }: AnnotationProps,
    ref,
  ) => {
    const props = {
      ...otherProps,
      animated,
      animationDuration,
      animationEasingFunction,
    };

    useImperativeHandle(
      ref,
      (): AnnotationRef => ({
        symbolStyle,
      }),
    );

    const [shape, setShape] = useState<Shape | null>(getShapeFromProps(props));

    // this will run useEffect only when actual coordinates values change
    const coordinateDeps = props.coordinates?.join(",");

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

    if (!props.coordinates) {
      return null;
    }

    const children = [];
    const symbolStyle: SymbolLayerStyle | undefined = props.icon
      ? {
          ...props.style,
          iconImage: typeof props.icon === "string" ? props.icon : undefined,
        }
      : undefined;

    if (symbolStyle) {
      children.push(
        <Layer type="symbol" id={`${props.id}-symbol`} style={symbolStyle} />,
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
      <Animated.GeoJSONSource
        id={props.id}
        testID={props.testID}
        onPress={props.onPress}
        data={shape as RNAnimated.WithAnimatedObject<GeoJSON.Point>}
      >
        {children}
      </Animated.GeoJSONSource>
    );
  },
);

Annotation.displayName = "Annotation";
