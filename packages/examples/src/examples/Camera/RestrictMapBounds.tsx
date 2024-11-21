import MapLibreGL from "@maplibre/maplibre-react-native";
import bboxPolygon from "@turf/bbox-polygon";
import React from "react";

import sheet from "../../styles/sheet";
import Page from "../common/Page";

const boundsStyle: MapLibreGL.FillLayerStyle = {
  fillColor: "rgba(255, 0, 0, 0.1)",
  fillOutlineColor: "red",
};

const BOUNDS = {
  ne: [-4.265762, 51.054738],
  sw: [-5.760365, 49.947256],
};

const POLYGON = bboxPolygon([
  BOUNDS.sw[0],
  BOUNDS.sw[1],
  BOUNDS.ne[0],
  BOUNDS.ne[1],
]);

export default function RestrictMapBounds() {
  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera maxBounds={BOUNDS} bounds={BOUNDS} />
        <MapLibreGL.ShapeSource id="bounds-source" shape={POLYGON}>
          <MapLibreGL.FillLayer id="bounds-fill" style={boundsStyle} />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </Page>
  );
}
