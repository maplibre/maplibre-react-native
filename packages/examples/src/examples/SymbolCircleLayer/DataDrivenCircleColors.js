import {
  CircleLayer,
  Camera,
  MapView,
  StyleURL,
  VectorSource,
} from "@maplibre/maplibre-react-native";
import React, { memo } from "react";

import { sheet } from "../../styles/sheet";

const styles = {
  circles: {
    circleRadius: [
      "interpolate",
      ["exponential", 1.75],
      ["zoom"],
      12,
      2,
      22,
      180,
    ],

    circleColor: [
      "match",
      ["get", "ethnicity"],
      "White",
      "#fbb03b",
      "Black",
      "#223b53",
      "Hispanic",
      "#e55e5e",
      "Asian",
      "#3bb2d0",
      /* other */ "#ccc",
    ],
  },
};

function DataDrivenCircleColors() {
  return (
    <MapView styleURL={StyleURL.Default} style={sheet.matchParent}>
      <Camera
        zoomLevel={10}
        pitch={45}
        centerCoordinate={[-122.400021, 37.789085]}
      />

      <VectorSource id="population" url="mapbox://examples.8fgz4egr">
        <CircleLayer
          id="sf2010CircleFill"
          sourceLayerID="sf2010"
          style={styles.circles}
        />
      </VectorSource>
    </MapView>
  );
}

const MemoDataDrivenCircleColors = memo(DataDrivenCircleColors);
export { MemoDataDrivenCircleColors as DataDrivenCircleColors };
