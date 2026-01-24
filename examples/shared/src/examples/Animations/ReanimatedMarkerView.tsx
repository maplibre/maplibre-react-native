import {
  Camera,
  type LngLat,
  MapView,
  MarkerView,
} from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  createAnimatedPropAdapter,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const AnimatedMarkerView = Animated.createAnimatedComponent(MarkerView);

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

// Adapter to convert animated lngLat array to the format MarkerView expects
const lngLatAdapter = createAnimatedPropAdapter((props) => {
  if (props.lngLat) {
    // lngLat is already an array, just ensure it's the right format
    props.lngLat = props.lngLat;
  }
});

/**
 * Demonstrates animating MarkerView using Reanimated:
 * 1. Position animation - smooth coordinate changes (useful for vehicle tracking)
 * 2. Rotation animation - smooth rotation without flickering (useful for heading/yaw)
 *
 * @see https://github.com/maplibre/maplibre-react-native/issues/643 (position animation)
 * @see https://github.com/maplibre/maplibre-react-native/issues/941 (rotation animation)
 */
export const ReanimatedMarkerView = () => {
  // Position animation for moving marker
  const animatedLngLat = useSharedValue(START);
  // Rotation animation for aircraft marker
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animate position from START to END and back
    animatedLngLat.value = withRepeat(
      withTiming(END, { duration: 5000 }),
      -1,
      true,
    );

    // Continuous rotation animation (0 -> 360 degrees)
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [animatedLngLat, rotation]);

  const animatedProps = useAnimatedProps(
    () => {
      return {
        lngLat: animatedLngLat.value as LngLat,
      };
    },
    [],
    lngLatAdapter,
  );

  // Animated style for rotation - runs on UI thread without React re-renders
  const animatedRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera
        initialViewState={{
          center: CENTER,
          zoom: 2,
        }}
      />

      {/* Position animation demo (#643) */}
      <AnimatedMarkerView lngLat={START} animatedProps={animatedProps}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>Move</Text>
        </View>
      </AnimatedMarkerView>

      {/* Rotation animation demo (#941) - Aircraft heading indicator */}
      <MarkerView lngLat={AIRCRAFT_POS} anchor={{ x: 0.5, y: 0.5 }}>
        <View style={styles.aircraftContainer}>
          <Animated.View
            style={[styles.aircraftContainer, animatedRotationStyle]}
          >
            <View style={styles.aircraft} />
          </Animated.View>
        </View>
      </MarkerView>
    </MapView>
  );
};
