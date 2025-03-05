import { Animated, Camera, MapView } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Animated as RNAnimated, Button, Easing } from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

const lon = 0;
const lat = 0;
const delta = 0.25;
const steps = 64;

const styles = {
  lineLayerOne: {
    lineCap: "round",
    lineWidth: 6,
    lineOpacity: 0.84,
    lineColor: "#514ccd",
  },
  circleLayer: {
    circleOpacity: 0.8,
    circleColor: "#c62221",
    circleRadius: 20,
  },
  lineLayerTwo: {
    lineCap: "round",
    lineWidth: 6,
    lineOpacity: 0.84,
    lineColor: "#314ccd",
  },
};

export function AnimatedLineStringGeometry() {
  const shape = useRef(
    new Animated.CoordinatesArray(
      [...Array(steps).keys()].map((_value, index) => [index, index]),
    ),
  ).current;

  const startRotation = () => {
    shape
      .timing({
        toValue: [...Array(steps).keys()].map((_value, index) => [
          index * -1,
          index,
        ]),
        duration: 1000,
        easing: Easing.linear,
      })
      .start();
    setTimeout(() => {
      shape
        .timing({
          toValue: [...Array(steps).keys()].map((_value, index) => [
            index * -1,
            index * -1,
          ]),
          duration: 1000,
          easing: Easing.linear,
        })
        .start();
    }, 1000);
    setTimeout(() => {
      shape
        .timing({
          toValue: [...Array(steps).keys()].map((_value, index) => [
            index,
            index * -1,
          ]),
          duration: 1000,
          easing: Easing.linear,
        })
        .start();
    }, 2000);
    setTimeout(() => {
      shape
        .timing({
          toValue: [...Array(steps).keys()].map((_value, index) => [
            index,
            index,
          ]),
          duration: 1000,
          easing: Easing.linear,
        })
        .start();
    }, 3000);
  };

  const startAnimateFewPointsWithAbort = () => {
    const time = 3000;

    setTimeout(() => {
      shape
        .timing({
          toValue: [
            [lon + delta, lat],
            [lon, lat],
            [lon, lat + delta],
          ],
          duration: time,
          easing: Easing.linear,
        })
        .start();
    }, 2000);

    setTimeout(() => {
      shape
        .timing({
          toValue: [
            [lon + delta, lat],
            [lon, lat],
            [lon + delta, lat + delta],
          ],
          duration: time,
          easing: Easing.linear,
        })
        .start();
    }, 4000);

    setTimeout(() => {
      shape
        .timing({
          toValue: [
            [lon, lat],
            [lon, lat + delta],
          ],
          duration: time,
          easing: Easing.linear,
        })
        .start();
    }, 6000);
  };

  const startAnimateMorphingRoute = () => {
    const time = 3000;

    setTimeout(() => {
      shape
        .timing({
          toValue: [
            [lon, lat],
            [lon, lat + 2 * delta],
            [lon + delta, lat + 2 * delta + delta],
            [lon + delta + 2 * delta, lat + 2 * delta + delta + delta],
          ],
          duration: time,
          easing: Easing.linear,
        })
        .start();
    }, 0);

    setTimeout(() => {
      shape
        .timing({
          toValue: [
            [lon, lat],
            [lon, lat + 1 * delta],
          ],
          duration: time,
          easing: Easing.linear,
        })
        .start();
    }, time);
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
            })
          }
        >
          <Animated.LineLayer id="line" style={styles.lineLayerTwo} />
        </Animated.ShapeSource>
      </MapView>

      <Bubble>
        <Button title="Rotate" onPress={() => startRotation()} />
        <Button
          title="Animate a few points with abort"
          onPress={() => startAnimateFewPointsWithAbort()}
        />
        <Button
          title="Animate route/morphing"
          onPress={() => startAnimateMorphingRoute()}
        />
      </Bubble>
    </>
  );
}
