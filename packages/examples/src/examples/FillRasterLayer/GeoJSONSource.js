import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";

import smileyFaceGeoJSON from "../../assets/geojson/smiley-face.json";
import gridPattern from "../../assets/images/grid-pattern.png";
import Page from "../../components/Page";
import sheet from "../../styles/sheet";

const layerStyles = {
  background: {
    backgroundPattern: gridPattern,
  },
  smileyFace: {
    fillAntialias: true,
    fillColor: "white",
    fillOutlineColor: "rgba(255, 255, 255, 0.84)",
  },
};

function GeoJSONSource() {
  return (
    <Page>
      <MapLibreGL.MapView
        style={sheet.matchParent}
        styleURL={MapLibreGL.StyleURL.Default}
      >
        <MapLibreGL.Camera
          zoomLevel={2}
          centerCoordinate={[-35.15165038, 40.6235728]}
        />

        <MapLibreGL.VectorSource>
          <MapLibreGL.BackgroundLayer
            id="background"
            style={layerStyles.background}
          />
        </MapLibreGL.VectorSource>

        <MapLibreGL.ShapeSource id="smileyFaceSource" shape={smileyFaceGeoJSON}>
          <MapLibreGL.FillLayer
            id="smileyFaceFill"
            style={layerStyles.smileyFace}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </Page>
  );
}

export default GeoJSONSource;
