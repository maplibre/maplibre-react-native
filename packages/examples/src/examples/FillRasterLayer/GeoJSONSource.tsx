import {
  BackgroundLayer,
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "../../assets/geojson/smiley.json";
import gridPattern from "../../assets/images/maplibre.png";
import { sheet } from "../../styles/sheet";

export function GeoJSONSource() {
  return (
    <MapView style={sheet.matchParent}>
      <Camera zoomLevel={2} centerCoordinate={[-35.15165038, 40.6235728]} />

      <BackgroundLayer
        id="background"
        style={{
          backgroundPattern: gridPattern,
        }}
      />

      <ShapeSource
        id="smiley-source"
        shape={smileyFeatureCollection as FeatureCollection}
      >
        <FillLayer
          id="smiley-fill"
          style={{
            fillAntialias: true,
            fillColor: "white",
            fillOutlineColor: "rgba(255, 255, 255, 0.84)",
          }}
        />
      </ShapeSource>
    </MapView>
  );
}
