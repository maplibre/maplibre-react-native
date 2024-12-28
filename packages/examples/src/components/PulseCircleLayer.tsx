import {
  Animated as MLRNAnimated,
  type CircleLayerStyle,
} from "@maplibre/maplibre-react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const styles: {
  innerCircle: CircleLayerStyle;
  innerCirclePulse: CircleLayerStyle;
  outerCircle: CircleLayerStyle;
} = {
  innerCircle: {
    circleColor: "white",
    circleStrokeWidth: 1,
    circleStrokeColor: "#c6d2e1",
  },
  innerCirclePulse: {
    circleColor: "#4264fb",
    circleStrokeColor: "#c6d2e1",
    circleStrokeWidth: 1,
  },
  outerCircle: {
    circleOpacity: 0.4,
    circleColor: "#c6d2e1",
  },
};

interface PulseCircleLayerProps {
  radius?: number;
  pulseRadius?: number;
  duration?: number;
  shape?: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
  aboveLayerID?: string;
}

function PulseCircleLayer({
  radius = 6,
  pulseRadius = 20,
  duration = 1000,
  shape,
  aboveLayerID,
}: PulseCircleLayerProps) {
  const animatedRadius = useRef(new Animated.Value(radius * 0.5)).current;
  const animatedPulseOpacity = useRef(new Animated.Value(1)).current;
  const animatedPulseRadius = useRef(new Animated.Value(radius)).current;

  useEffect(() => {
    const growAnimation = Animated.parallel([
      Animated.timing(animatedRadius, {
        toValue: radius * 0.7,
        duration: duration / 2,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPulseRadius, {
        toValue: pulseRadius,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPulseOpacity, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }),
    ]);

    const shrinkAnimation = Animated.parallel([
      Animated.timing(animatedRadius, {
        toValue: radius * 0.5,
        duration: duration / 2,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPulseRadius, {
        toValue: radius,
        duration: duration / 2,
        useNativeDriver: false,
      }),
    ]);

    const animationLoop = Animated.loop(
      Animated.sequence([growAnimation, shrinkAnimation]),
    );

    animationLoop.start();

    return () => {
      animationLoop.stop();
    };
  }, []);

  if (!shape) {
    return null;
  }

  return (
    <MLRNAnimated.ShapeSource id="pulseCircleSource" shape={shape}>
      <MLRNAnimated.CircleLayer
        id="pulseOuterCircle"
        aboveLayerID={aboveLayerID}
        // @ts-ignore
        style={{
          ...styles.outerCircle,
          circleRadius: animatedPulseRadius,
          circleOpacity: animatedPulseOpacity,
        }}
      />
      <MLRNAnimated.CircleLayer
        id="pulseInnerCircleCnt"
        aboveLayerID="pulseOuterCircle"
        style={{ ...styles.innerCircle, circleRadius: radius }}
      />
      <MLRNAnimated.CircleLayer
        id="pulseInnerCircle"
        aboveLayerID="pulseInnerCircleCnt"
        style={{ ...styles.innerCirclePulse, circleRadius: animatedRadius }}
      />
    </MLRNAnimated.ShapeSource>
  );
}

const AnimatedPulseCircleLayer =
  Animated.createAnimatedComponent(PulseCircleLayer);

export { AnimatedPulseCircleLayer as PulseCircleLayer };
