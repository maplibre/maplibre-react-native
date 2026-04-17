import { Animated as MLRNAnimated } from "@maplibre/maplibre-react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface PulseCircleLayerProps {
  radius?: number;
  pulseRadius?: number;
  duration?: number;
  data?: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
  afterId?: string;
}

function PulseCircleLayer({
  radius = 6,
  pulseRadius = 20,
  duration = 1000,
  data,
  afterId,
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

  if (!data) {
    return null;
  }

  return (
    <MLRNAnimated.GeoJSONSource id="pulseCircleSource" data={data}>
      <MLRNAnimated.Layer
        id="pulseOuterCircle"
        type="circle"
        afterId={afterId}
        paint={{
          "circle-color": "#c6d2e1",
          "circle-radius": animatedPulseRadius,
          "circle-opacity": animatedPulseOpacity,
        }}
      />
      <MLRNAnimated.Layer
        type="circle"
        id="pulseInnerCircleCnt"
        afterId="pulseOuterCircle"
        paint={{
          "circle-color": "white",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#c6d2e1",
          "circle-radius": radius,
        }}
      />
      <MLRNAnimated.Layer
        type="circle"
        id="pulseInnerCircle"
        afterId="pulseInnerCircleCnt"
        paint={{
          "circle-color": "#4264fb",
          "circle-stroke-color": "#c6d2e1",
          "circle-stroke-width": 1,
          "circle-radius": animatedRadius,
        }}
      />
    </MLRNAnimated.GeoJSONSource>
  );
}

const AnimatedPulseCircleLayer =
  Animated.createAnimatedComponent(PulseCircleLayer);

export { AnimatedPulseCircleLayer as PulseCircleLayer };
