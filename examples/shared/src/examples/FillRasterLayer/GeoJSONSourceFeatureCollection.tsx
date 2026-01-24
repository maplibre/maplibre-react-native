import {
  BackgroundLayer,
  Camera,
  FillLayer,
  MapView,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "@/assets/geojson/smiley.json";
import gridPattern from "@/assets/images/maplibre.png";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GeoJSONSourceFeatureCollection() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera zoom={2} center={[-35.15165038, 40.6235728]} />

      <BackgroundLayer
        id="background"
        style={{
          backgroundPattern: gridPattern,
        }}
      />

      <GeoJSONSource
        id="smiley-source"
        data={smileyFeatureCollection as FeatureCollection}
      >
        <FillLayer
          id="smiley-fill"
          style={{
            fillAntialias: true,
            fillColor: "white",
            fillOutlineColor: "rgba(255, 255, 255, 0.84)",
          }}
        />
      </GeoJSONSource>
    </MapView>
  );
}
