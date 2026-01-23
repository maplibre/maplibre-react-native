import { Animated, Camera, MapView } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "@/components/Bubble";
import { ROUTE_FEATURE, ROUTE_FEATURE_BOUNDS } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const styles = {
  lineLayer: {
    lineCap: "round",
    lineWidth: 8,
    lineColor: colors.blue,
  },
  circleLayer: {
    circleOpacity: 0.8,
    circleColor: colors.grey,
    circleRadius: 20,
  },
} as const;

export function AnimatedLength() {
  const route = useRef(
    new Animated.RouteCoordinatesArray(
      ROUTE_FEATURE.geometry.coordinates as [number, number][],
    ),
  ).current;

  const routePoint = useRef(
    new Animated.ExtractCoordinateFromArray(route, -1),
  ).current;

  const animate = () => {
    const point =
      route.originalRoute[
        route.__getValue().length === 1 ? route.originalRoute.length - 1 : 0
      ]!;

    route
      .timing({
        toValue: { end: { point } },
        duration: 2000,
        easing: Easing.linear,
      })
      .start();
  };

  const animatedShapeLineString = useRef(
    new Animated.Shape({
      type: "LineString",
      coordinates: route,
    }),
  ).current;

  const animatedShapePoint = useRef(
    new Animated.Shape({
      type: "Point",
      coordinates: routePoint,
    }),
  ).current;

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera initialViewState={{ bounds: ROUTE_FEATURE_BOUNDS }} />

        <Animated.ShapeSource id="route" data={animatedShapeLineString}>
          <Animated.LineLayer id="lineroute" style={styles.lineLayer} />
        </Animated.ShapeSource>

        <Animated.ShapeSource
          id="currentLocationSource"
          data={animatedShapePoint}
        >
          <Animated.CircleLayer
            id="currentLocationCircle"
            style={styles.circleLayer}
          />
        </Animated.ShapeSource>
      </MapView>

      <Bubble>
        <Button title="Animate" onPress={() => animate()} />
      </Bubble>
    </>
  );
}
