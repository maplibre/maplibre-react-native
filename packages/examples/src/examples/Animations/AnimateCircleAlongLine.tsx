import MapLibreGL, {
  type LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import Page from "../../components/Page";
import PulseCircleLayer from "../../components/PulseCircleLayer";
import sheet from "../../styles/sheet";
import RouteSimulator from "../../utils/RouteSimulator";

const ROUTE_FEATURE: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [8.070566386917108, 53.295365558646694],
      [13.37432488261203, 52.50503393836857],
      [7.218077210609579, 50.98270036522064],
      [13.652081261390094, 49.583747114745165],
      [8.1694637345079, 47.9516814815924],
    ],
  },
  properties: {},
};

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

export default function AnimateCircleAlongLine() {
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
      <MapLibreGL.Animated.ShapeSource id="progressSource" shape={lineString}>
        {/* @ts-ignore */}
        <MapLibreGL.Animated.LineLayer
          id="progress-line"
          style={layerStyles.progress}
          aboveLayerID="route-line"
        />
      </MapLibreGL.Animated.ShapeSource>
    );
  };

  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera
          defaultSettings={{
            bounds: {
              ne: [-3.419709, 44.452929],
              sw: [25.309539, 55.766941],
            },
          }}
        />

        <MapLibreGL.ShapeSource id="route-source" shape={ROUTE_FEATURE}>
          <MapLibreGL.LineLayer id="route-line" style={layerStyles.route} />
        </MapLibreGL.ShapeSource>

        {currentPoint && <PulseCircleLayer shape={currentPoint} />}

        {renderProgressLine()}
      </MapLibreGL.MapView>
    </Page>
  );
}
