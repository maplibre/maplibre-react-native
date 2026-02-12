import { type LngLat, Map, Marker } from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  aircraft: {
    fontSize: 64,
    color: "#fff",
    textShadowColor: "#a3a3a3",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

const AMPLITUDE = 45;
const CIRCUMFERENCE = 360;

/**
 * Demonstrates animating Marker position and style using Reanimated.
 *
 * @see https://github.com/maplibre/maplibre-react-native/issues/643 (position animation)
 * @see https://github.com/maplibre/maplibre-react-native/issues/941 (rotation animation)
 */
export const ReanimatedMarker = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Continuous flight around the globe
    progress.value = withRepeat(
      withTiming(1, { duration: 30000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  // Calculate position along sine curve, wrapping around the globe
  const lng = useDerivedValue(() => {
    const rawLng = progress.value * CIRCUMFERENCE;
    return ((rawLng + 180) % 360) - 180;
  });
  const lat = useDerivedValue(() => {
    return AMPLITUDE * Math.sin(progress.value * Math.PI * 4);
  });

  // Calculate heading from the derivative of the sine curve
  const heading = useDerivedValue(() => {
    const dx = CIRCUMFERENCE;
    const dy = AMPLITUDE * Math.PI * 4 * Math.cos(progress.value * Math.PI * 4);

    return (Math.atan2(dx, dy) * 180) / Math.PI;
  });

  const animatedProps = useAnimatedProps<{ lngLat: LngLat }>(() => {
    return {
      lngLat: [lng.value, lat.value],
    };
  });

  const animatedRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${heading.value - 90}deg` }],
    };
  });

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <AnimatedMarker
        lngLat={[0, 0]}
        anchor="center"
        animatedProps={animatedProps}
      >
        <Animated.View style={[styles.container, animatedRotationStyle]}>
          <Text style={styles.aircraft}>✈</Text>
        </Animated.View>
      </AnimatedMarker>
    </Map>
  );
};
