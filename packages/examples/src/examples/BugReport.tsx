import {
  MapView,
  ShapeSource,
  SymbolLayer,
  CircleLayer,
  Camera,
} from "@maplibre/maplibre-react-native";
import React, { useState } from "react";
import { Button } from "react-native";

import Page from "./common/Page";

const styles = {
  mapView: { flex: 1 },
  circleLayer: {
    circleRadiusTransition: { duration: 5000, delay: 0 },
    circleColor: "#ff0000",
  },
};

const FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "a-feature",
      properties: {
        icon: "example",
        text: "example-icon-and-label",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.00597, 40.71427],
      },
    },
    {
      type: "Feature",
      id: "b-feature",
      properties: {
        text: "just-label",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.001097, 40.71527],
      },
    },
    {
      type: "Feature",
      id: "c-feature",
      properties: {
        icon: "example",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.00697, 40.72427],
      },
    },
  ],
};

export default function BugReport() {
  const [radius, setRadius] = useState(20);

  return (
    <Page>
      <Button
        title="Grow"
        onPress={() => setRadius((prevState) => prevState + 20)}
      />
      <MapView style={styles.mapView}>
        <Camera centerCoordinate={[-74.00597, 40.71427]} zoomLevel={14} />
        <ShapeSource id="shape-source-id-0" shape={FEATURE_COLLECTION}>
          <CircleLayer
            id="circle-layer"
            style={{
              ...styles.circleLayer,
              circleRadius: radius,
            }}
          />
          <SymbolLayer
            id="symbol-id"
            style={{
              iconImage: ["get", "icon"],
            }}
          />
        </ShapeSource>
      </MapView>
    </Page>
  );
}
