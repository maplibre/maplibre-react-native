import {
  Animated,
  Camera,
  LineLayer,
  type LineLayerStyle,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { Animated as RNAnimated } from "react-native";

import { PulseCircleLayer } from "../../components/PulseCircleLayer";
import {
  ROUTE_FEATURE,
  ROUTE_FEATURE_BOUNDS,
} from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";
import { RouteSimulator } from "../../utils/RouteSimulator";

const layerStyles: {
  route: LineLayerStyle;
  progress: LineLayerStyle;
} = {
  route: {
    lineColor: "white",
    lineCap: "round",
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: "#314ccd",
    lineWidth: 3,
  },
};

export function AnimateCircleAlongLine() {
  const [currentPoint, setCurrentPoint] =
    useState<
      GeoJSON.Feature<GeoJSON.Point, { distance: number; nearestIndex: number }>
    >();

  useEffect(() => {
    const routeSimulator = new RouteSimulator(ROUTE_FEATURE);

    routeSimulator.addListener(
      (
        point: GeoJSON.Feature<
          GeoJSON.Point,
          { distance: number; nearestIndex: number }
        >,
      ) => {
        setCurrentPoint(point);
      },
    );

    routeSimulator.start();

    return () => {
      routeSimulator.stop();
    };
  }, []);

  const renderProgressLine = () => {
    if (!currentPoint) {
      return null;
    }

    const { nearestIndex } = currentPoint.properties;
    const coords = ROUTE_FEATURE.geometry.coordinates.filter(
      (_coordinates, index) => index <= nearestIndex,
    );
    coords.push(currentPoint.geometry.coordinates);

    if (coords.length < 2) {
      return null;
    }

    const lineString: GeoJSON.LineString = {
      type: "LineString",
      coordinates: coords,
    };

    return (
      <Animated.ShapeSource id="progressSource" shape={lineString}>
        <Animated.LineLayer
          id="progress-line"
          style={
            layerStyles.progress as unknown as RNAnimated.WithAnimatedObject<LineLayerStyle>
          }
          aboveLayerID="route-line"
        />
      </Animated.ShapeSource>
    );
  };

  return (
    <MapView style={sheet.matchParent}>
      <Camera defaultSettings={{ bounds: ROUTE_FEATURE_BOUNDS }} />

      <ShapeSource id="route-source" shape={ROUTE_FEATURE}>
        <LineLayer id="route-line" style={layerStyles.route} />
      </ShapeSource>

      {currentPoint && <PulseCircleLayer shape={currentPoint} />}

      {renderProgressLine()}
    </MapView>
  );
}
