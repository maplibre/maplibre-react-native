import { Animated, Camera, MapView } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "../../components/Bubble";
import { ROUTE_FEATURE } from "../../constants/GEOMETRIES";
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

  console.log("render");

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

  console.log(route.__getValue());

  return (
    <>
      <MapView style={sheet.matchParent}>
        <Camera
          defaultSettings={{
            bounds: {
              ne: [-3.419709, 44.452929],
              sw: [25.309539, 55.766941],
            },
          }}
        />

        <Animated.ShapeSource id="route" shape={animatedShapeLineString}>
          <Animated.LineLayer id="lineroute" style={styles.lineLayerOne} />
        </Animated.ShapeSource>

        <Animated.ShapeSource
          id="currentLocationSource"
          shape={animatedShapePoint}
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
