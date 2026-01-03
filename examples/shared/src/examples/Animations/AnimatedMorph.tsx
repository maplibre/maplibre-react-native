import {
  Animated,
  type LineLayerStyle,
  MapView,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button, Easing } from "react-native";

import { Bubble } from "../../components/Bubble";
import { colors } from "../../styles/colors";

const STEPS = 1000;
const SIN_COORDINATES = [...Array(STEPS).keys()].map(
  (_value, index) =>
    [index * 0.2 - STEPS * 0.1, Math.sin(index * 0.05) * 10] as [
      number,
      number,
    ],
);
const LINE_COORDINATES = [...Array(STEPS).keys()].map(
  (_value, index) => [index * 0.2 - STEPS * 0.1, 0] as [number, number],
);

const lineLayerStyle: LineLayerStyle = {
  lineCap: "round",
  lineWidth: 8,
  lineColor: colors.blue,
};

type MorphType = "line" | "sin";

export function AnimatedMorph() {
  const [type, setType] = useState<MorphType>("line");

  const shape = useRef(new Animated.CoordinatesArray(LINE_COORDINATES)).current;

  const animateMorph = (animateTo: MorphType) => {
    shape
      .timing({
        toValue: {
          line: LINE_COORDINATES,
          sin: SIN_COORDINATES,
        }[animateTo],
        duration: 1000,
        easing: Easing.ease,
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
          title="Morph"
          onPress={() => {
            const newValue = (
              {
                line: "sin",
                sin: "line",
              } as const
            )[type];

            animateMorph(newValue);
            setType(newValue);
          }}
        />
      </Bubble>
    </>
  );
}
