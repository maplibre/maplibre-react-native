import {
  Animated,
  type LineLayerStyle,
  MapView,
} from "@maplibre/maplibre-react-native";
import circle from "@turf/circle";
import { useRef, useState } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const STEPS = 1000;
const LARGE_CIRCLE_COORDINATES = circle([0, 0], 5000, {
  steps: STEPS,
}).geometry.coordinates[0] as [number, number][];
const SMALL_CIRCLE_COORDINATES = circle([0, 0], 500, {
  steps: STEPS,
}).geometry.coordinates[0] as [number, number][];

const lineLayerStyle: LineLayerStyle = {
  lineCap: "round",
  lineWidth: 8,
  lineColor: colors.blue,
};

type CircleSize = "small" | "large";

export function AnimatedSize() {
  const [size, setSize] = useState<CircleSize>("small");

  const animatedCoordinatesArrayRef = useRef(
    new Animated.CoordinatesArray(SMALL_CIRCLE_COORDINATES),
  ).current;

  const animateSize = (animateTo: CircleSize) => {
    animatedCoordinatesArrayRef
      .timing({
        toValue: {
          small: SMALL_CIRCLE_COORDINATES,
          large: LARGE_CIRCLE_COORDINATES,
        }[animateTo],
        duration: 1000,
        easing: Easing.bounce,
      })
      .start();
  };

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Animated.GeoJSONSource
          data={
            new Animated.GeoJSON({
              type: "LineString",
              coordinates: animatedCoordinatesArrayRef,
            })
          }
        >
          <Animated.LineLayer id="line" style={lineLayerStyle} />
        </Animated.GeoJSONSource>
      </MapView>

      <Bubble>
        <Button
          title="Bounce"
          onPress={() => {
            const newValue = (
              {
                large: "small",
                small: "large",
              } as const
            )[size];

            animateSize(newValue);
            setSize(newValue);
          }}
        />
      </Bubble>
    </>
  );
}
