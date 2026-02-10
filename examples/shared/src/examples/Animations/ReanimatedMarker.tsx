import {
  Camera,
  type LngLat,
  Map,
  Marker,
} from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

const styles = StyleSheet.create({
  marker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Aircraft marker styles for rotation demo (#941)
  aircraftContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  aircraft: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FF6B6B",
  },
});

const CENTER: LngLat = [0, 0];
const START: LngLat = [-20, -20];
const END: LngLat = [20, 20];
const AIRCRAFT_POS: LngLat = [20, -10];

/**
 * Demonstrates animating Marker using Reanimated:
 * 1. Position animation - smooth coordinate changes (useful for vehicle tracking)
 * 2. Rotation animation - smooth rotation without flickering (useful for heading/yaw)
 *
 * @see https://github.com/maplibre/maplibre-react-native/issues/643 (position animation)
 * @see https://github.com/maplibre/maplibre-react-native/issues/941 (rotation animation)
 */
export const ReanimatedMarker = () => {
  // Position animation for moving marker (separate scalars for smooth interpolation)
  const lng = useSharedValue(START[0]);
  const lat = useSharedValue(START[1]);
  // Rotation animation for aircraft marker
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animate position from START to END and back
    lng.value = withRepeat(withTiming(END[0], { duration: 5000 }), -1, true);
    lat.value = withRepeat(withTiming(END[1], { duration: 5000 }), -1, true);

    // Continuous rotation animation (0 -> 360 degrees)
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [lng, lat, rotation]);

  const animatedProps = useAnimatedProps(() => {
    return {
      lngLat: [lng.value, lat.value] as LngLat,
    };
  });

  // Animated style for rotation - runs on UI thread without React re-renders
  const animatedRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera
        initialViewState={{
          center: CENTER,
          zoom: 2,
        }}
      />

      {/* Position animation demo (#643) */}
      <AnimatedMarker lngLat={START} animatedProps={animatedProps}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>Move</Text>
        </View>
      </AnimatedMarker>

      {/* Rotation animation demo (#941) - Aircraft heading indicator */}
      <Marker lngLat={AIRCRAFT_POS} anchor="center">
        <View style={styles.aircraftContainer}>
          <Animated.View
            style={[styles.aircraftContainer, animatedRotationStyle]}
          >
            <View style={styles.aircraft} />
          </Animated.View>
        </View>
      </Marker>
    </Map>
  );
};
