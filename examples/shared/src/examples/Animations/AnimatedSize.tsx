import {
  Animated,
  type LineLayerStyle,
  MapView,
} from "@maplibre/maplibre-react-native";
import circle from "@turf/circle";
import { useRef, useState } from "react";
import { Animated as RNAnimated, Button, Easing } from "react-native";

import { Bubble } from "../../components/Bubble";
import { colors } from "../../styles/colors";
import { sheet } from "../../styles/sheet";

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
      <MapView style={sheet.matchParent}>
        <Animated.ShapeSource
          id="shape"
          shape={
            new Animated.Shape({
              type: "LineString",
              coordinates: shape,
            }) as unknown as RNAnimated.WithAnimatedObject<GeoJSON.LineString>
          }
        >
          <Animated.LineLayer
            id="line"
            style={
              lineLayerStyle as unknown as RNAnimated.WithAnimatedObject<LineLayerStyle>
            }
          />
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
