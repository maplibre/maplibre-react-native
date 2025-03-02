import {
  Animated,
  Camera,
  type CircleLayerStyle,
  type LineLayerStyle,
  MapView,
} from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Animated as RNAnimated, Button, Easing } from "react-native";

import { Bubble } from "../../components/Bubble";
import {
  ROUTE_FEATURE,
  ROUTE_FEATURE_BOUNDS,
} from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

const styles = {
  lineLayerOne: {
    lineCap: "round",
    lineWidth: 6,
    lineOpacity: 0.84,
    lineColor: "red",
  },
  circleLayer: {
    circleOpacity: 0.8,
    circleColor: "#c62221",
    circleRadius: 20,
  },
} as const;

export function AnimatedLineStringLength() {
  const route = useRef(
    new Animated.RouteCoordinatesArray(
      ROUTE_FEATURE.geometry.coordinates as [number, number][],
    ),
  ).current;

  const actPoint = useRef(
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
      coordinates: actPoint,
    }),
  ).current;

  return (
    <>
      <MapView style={sheet.matchParent}>
        <Camera defaultSettings={{ bounds: ROUTE_FEATURE_BOUNDS }} />

        <Animated.ShapeSource
          id="route"
          shape={
            animatedShapeLineString as unknown as RNAnimated.WithAnimatedObject<GeoJSON.LineString>
          }
        >
          <Animated.LineLayer
            id="lineroute"
            style={
              styles.lineLayerOne as unknown as RNAnimated.WithAnimatedObject<LineLayerStyle>
            }
          />
        </Animated.ShapeSource>

        <Animated.ShapeSource
          id="currentLocationSource"
          shape={
            animatedShapePoint as unknown as RNAnimated.WithAnimatedObject<GeoJSON.Point>
          }
        >
          <Animated.CircleLayer
            id="currentLocationCircle"
            style={
              styles.circleLayer as unknown as RNAnimated.WithAnimatedObject<CircleLayerStyle>
            }
          />
        </Animated.ShapeSource>
      </MapView>

      <Bubble>
        <Button title="Animate" onPress={() => animate()} />
      </Bubble>
    </>
  );
}
