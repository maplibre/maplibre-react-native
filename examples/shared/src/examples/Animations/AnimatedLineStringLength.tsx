import { Animated, Camera, MapView } from "@maplibre/maplibre-react-native";
import along from "@turf/along";
import { lineString, point } from "@turf/helpers";
import length from "@turf/length";
import { useRef, useState } from "react";
import { Animated as RNAnimated, Button, Easing } from "react-native";

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

  const [actPoint] = useState(
    new Animated.ExtractCoordinateFromArray(route, -1),
  );

  const startAnimateRoute = () => {
    const routeLineString = lineString(route.__getValue());
    const routeLength = length(routeLineString, { units: "meters" });

    console.log("routeLength", routeLength);

    let destination = routeLength - 100000;
    let routePoint;
    if (routeLength === 0.0) {
      const { originalRoute } = route;
      destination = length(lineString(originalRoute), { units: "meters" });
      routePoint = point(originalRoute[originalRoute.length - 1]!);
    } else {
      if (destination < 0) {
        destination = 0;
      }
    }

    routePoint = along(routeLineString, destination, { units: "meters" });

    route
      .timing({
        toValue: { end: { point: routePoint } },
        duration: 2000,
        easing: Easing.linear,
      })
      .start();
  };

  console.log("render");

  const animatedShape = useRef(
    new Animated.Shape({
      type: "LineString",
      coordinates: route,
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

        <Animated.ShapeSource id="route" shape={animatedShape}>
          <Animated.LineLayer id="lineroute" style={styles.lineLayerOne} />
        </Animated.ShapeSource>

        <Animated.ShapeSource
          id="currentLocationSource"
          shape={
            new Animated.Shape({
              type: "Point",
              coordinates: actPoint,
            })
          }
        >
          <Animated.CircleLayer
            id="currentLocationCircle"
            style={styles.circleLayer}
          />
        </Animated.ShapeSource>
      </MapView>

      <Bubble>
        <Button title="Animate route" onPress={() => startAnimateRoute()} />
      </Bubble>
    </>
  );
}
