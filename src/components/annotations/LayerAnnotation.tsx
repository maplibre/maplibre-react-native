import { type ReactNode, useEffect, useState } from "react";
import {
  Animated as RNAnimated,
  Easing,
  type NativeSyntheticEvent,
} from "react-native";

import type { BaseProps } from "../../types/BaseProps";
import type { LngLat } from "../../types/LngLat";
import type { PressEventWithFeatures } from "../../types/PressEventWithFeatures";
import { Animated } from "../../utils/animated/Animated";
import { AnimatedPoint } from "../../utils/animated/AnimatedPoint";

export interface LayerAnnotationProps extends BaseProps {
  id?: string;
  lngLat: LngLat;
  animated?: boolean;
  animationDuration?: number;
  animationEasingFunction?: (x: number) => number;
  onPress?: (event: NativeSyntheticEvent<PressEventWithFeatures>) => void;
  children?: ReactNode;
}

type Data = AnimatedPoint | GeoJSON.Point;

const isAnimated = (data: Data): data is AnimatedPoint =>
  data instanceof AnimatedPoint;

/**
 * Convenience wrapper around a GeoJSONSource for a Point/LngLat, optionally
 * animated.
 */
export const LayerAnnotation = ({
  lngLat,
  animated = false,
  animationDuration = 1000,
  animationEasingFunction = Easing.linear,
  ...props
}: LayerAnnotationProps) => {
  const [data, setData] = useState<Data>(() => {
    const point: GeoJSON.Point = {
      type: "Point",
      coordinates: lngLat,
    };

    if (animated) {
      return new AnimatedPoint(point);
    }

    return point;
  });

  useEffect(() => {
    if (isAnimated(data)) {
      data.stopAnimation();
      data
        .timing({
          toValue: { type: "Point", coordinates: lngLat },
          easing: animationEasingFunction,
          duration: animationDuration,
        })
        .start();
    } else {
      setData({ type: "Point", coordinates: lngLat });
    }
  }, [lngLat[0], lngLat[1]]);

  return (
    <Animated.GeoJSONSource
      data={data as RNAnimated.WithAnimatedObject<GeoJSON.Point>}
      {...props}
    />
  );
};
