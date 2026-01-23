import {
  Animated,
  type LineLayerStyle,
  MapView,
} from "@maplibre/maplibre-react-native";
import circle from "@turf/circle";
import { useRef, useState } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "@/components/Bubble";
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

  const shape = useRef(
    new Animated.CoordinatesArray(SMALL_CIRCLE_COORDINATES),
  ).current;

  const animateSize = (animateTo: CircleSize) => {
    shape
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
      <MapView>
        <Animated.ShapeSource
          id="shape"
          data={
            new Animated.Shape({
              type: "LineString",
              coordinates: shape,
            })
          }
        >
          <Animated.LineLayer id="line" style={lineLayerStyle} />
        </Animated.ShapeSource>
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
