import {
  CircleLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useEffect } from "react";
import Animated, {
  createAnimatedPropAdapter,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "../../styles/colors";

const circleLayerStyle = {
  circleRadius: 20,
  circleColor: colors.blue,
};
const AnimatedShape = Animated.createAnimatedComponent(ShapeSource);

const shapeAdapter = createAnimatedPropAdapter((props) => {
  props.shape = JSON.stringify(props.shape);
});

export const ReanimatedPoint = () => {
  const animatedFollowPoint = useSharedValue([0, 0]);

  useEffect(() => {
    animatedFollowPoint.value = withTiming([45, 45], { duration: 10000 });
  }, []);

  const animatedProps = useAnimatedProps(
    () => {
      const shape: GeoJSON.Point = {
        type: "Point",
        coordinates: animatedFollowPoint.value,
      };
      return { shape };
    },
    null,
    shapeAdapter,
  );

  return (
    <MapView style={{ flex: 1 }}>
      <AnimatedShape id="shape" animatedProps={animatedProps}>
        <CircleLayer id="circle" style={circleLayerStyle} />
      </AnimatedShape>
    </MapView>
  );
};
