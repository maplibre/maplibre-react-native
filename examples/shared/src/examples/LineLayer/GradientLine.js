import {
  Camera,
  LineLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import React, { Component } from "react";

import { sheet } from "../../styles/sheet";

const styles = {
  lineLayer: {
    lineColor: "red",
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 14,
    lineGradient: [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "blue",
      0.1,
      "royalblue",
      0.3,
      "cyan",
      0.5,
      "lime",
      0.7,
      "yellow",
      1,
      "red",
    ],
  },
};

export class GradientLine extends Component {
  render() {
    return (
      <MapView style={sheet.matchParent}>
        <Camera centerCoordinate={[-77.035, 38.875]} zoomLevel={12} />
        <ShapeSource
          id="source1"
          lineMetrics
          shape={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [-77.044211, 38.852924],
                [-77.045659, 38.860158],
                [-77.044232, 38.862326],
                [-77.040879, 38.865454],
                [-77.039936, 38.867698],
                [-77.040338, 38.86943],
                [-77.04264, 38.872528],
                [-77.03696, 38.878424],
                [-77.032309, 38.87937],
                [-77.030056, 38.880945],
                [-77.027645, 38.881779],
                [-77.026946, 38.882645],
                [-77.026942, 38.885502],
                [-77.028054, 38.887449],
                [-77.02806, 38.892088],
                [-77.03364, 38.892108],
                [-77.033643, 38.899926],
              ],
            },
          }}
        >
          <LineLayer id="layer1" style={styles.lineLayer} />
        </ShapeSource>
      </MapView>
    );
  }
}
