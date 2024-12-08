import MapLibreGL from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

import smileyFeatureCollection from "../../assets/geojson/smiley.json";
import gridPattern from "../../assets/images/maplibre.png";
import { sheet } from "../../styles/sheet";

export default function GeoJSONSource() {
  return (
    <MapLibreGL.MapView style={sheet.matchParent}>
      <MapLibreGL.Camera
        zoomLevel={2}
        centerCoordinate={[-35.15165038, 40.6235728]}
      />

      <MapLibreGL.BackgroundLayer
        id="background"
        style={{
          backgroundPattern: gridPattern,
        }}
      />

      <MapLibreGL.ShapeSource
        id="smiley-source"
        shape={smileyFeatureCollection as FeatureCollection}
      >
        <MapLibreGL.FillLayer
          id="smiley-fill"
          style={{
            fillAntialias: true,
            fillColor: "white",
            fillOutlineColor: "rgba(255, 255, 255, 0.84)",
          }}
        />
      </MapLibreGL.ShapeSource>
    </MapLibreGL.MapView>
  );
}
