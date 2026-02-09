import { Animated, Camera, Map } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "@/components/Bubble";
import { ROUTE_FEATURE, ROUTE_FEATURE_BOUNDS } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

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

  const animatedGeoJSONLineString = useRef(
    new Animated.GeoJSON({
      type: "LineString",
      coordinates: route,
    }),
  ).current;

  const animatedGeoJSONPoint = useRef(
    new Animated.GeoJSON({
      type: "Point",
      coordinates: routePoint,
    }),
  ).current;

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera initialViewState={{ bounds: ROUTE_FEATURE_BOUNDS }} />

        <Animated.GeoJSONSource id="route" data={animatedGeoJSONLineString}>
          <Animated.Layer
            type="line"
            id="lineroute"
            layout={{
              "line-cap": "round",
            }}
            paint={{
              "line-width": 8,
              "line-color": colors.blue,
            }}
          />
        </Animated.GeoJSONSource>

        <Animated.GeoJSONSource
          id="currentLocationSource"
          data={animatedGeoJSONPoint}
        >
          <Animated.Layer
            type="circle"
            id="currentLocationCircle"
            paint={{
              "circle-opacity": 0.8,
              "circle-color": colors.grey,
              "circle-radius": 20,
            }}
          />
        </Animated.GeoJSONSource>
      </Map>

      <Bubble>
        <Button title="Animate" onPress={() => animate()} />
      </Bubble>
    </>
  );
}
