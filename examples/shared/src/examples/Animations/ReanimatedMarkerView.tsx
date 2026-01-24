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
  useSharedValue,
  withRepeat,
  withTiming,
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
});

const CENTER: LngLat = [0, 0];
const START: LngLat = [-20, -20];
const END: LngLat = [20, 20];

// Adapter to convert animated lngLat array to the format MarkerView expects
const lngLatAdapter = createAnimatedPropAdapter((props) => {
  if (props.lngLat) {
    // lngLat is already an array, just ensure it's the right format
    props.lngLat = props.lngLat;
  }
});

/**
 * Demonstrates animating a MarkerView's position using Reanimated.
 * This is useful for smooth marker animations like vehicle tracking.
 *
 * @see https://github.com/maplibre/maplibre-react-native/issues/643
 */
export const ReanimatedMarkerView = () => {
  const animatedLngLat = useSharedValue(START);

  useEffect(() => {
    // Animate from START to END and back, repeating infinitely
    animatedLngLat.value = withRepeat(
      withTiming(END, { duration: 5000 }),
      -1,
      true,
    );
  }, [animatedLngLat]);

  const animatedProps = useAnimatedProps(
    () => {
      return {
        lngLat: animatedLngLat.value as LngLat,
      };
    },
    [],
    lngLatAdapter,
  );

  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera
        initialViewState={{
          center: CENTER,
          zoom: 2,
        }}
      />

      <AnimatedMarkerView lngLat={START} animatedProps={animatedProps}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>Move</Text>
        </View>
      </AnimatedMarkerView>
    </MapView>
  );
};
