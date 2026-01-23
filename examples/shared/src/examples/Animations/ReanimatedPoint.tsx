import {
  CircleLayer,
  MapView,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import Animated, {
  createAnimatedPropAdapter,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const circleLayerStyle = {
  circleRadius: 20,
  circleColor: colors.blue,
};
const AnimatedGeoJSONSource = Animated.createAnimatedComponent(GeoJSONSource);

const geoJSONDataAdapter = createAnimatedPropAdapter((props) => {
  props.data = JSON.stringify(props.data);
});

export const ReanimatedPoint = () => {
  const animatedFollowPoint = useSharedValue([0, 0]);

  useEffect(() => {
    animatedFollowPoint.value = withTiming([45, 45], { duration: 10000 });
  }, []);

  const animatedProps = useAnimatedProps(
    () => {
      const data: GeoJSON.Point = {
        type: "Point",
        coordinates: animatedFollowPoint.value,
      };

      return { data };
    },
    null,
    geoJSONDataAdapter,
  );

  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <AnimatedGeoJSONSource
        data={{ type: "Point", coordinates: [0, 0] }}
        animatedProps={animatedProps}
      >
        <CircleLayer id="circle" style={circleLayerStyle} />
      </AnimatedGeoJSONSource>
    </MapView>
  );
};
