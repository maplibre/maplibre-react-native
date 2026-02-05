import {
  Camera,
  Layer,
  Map,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "@/assets/geojson/smiley.json";
import gridPattern from "@/assets/images/maplibre.png";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GeoJSONSourceFeatureCollection() {
  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera zoom={2} center={[-35.15165038, 40.6235728]} />

      <Layer
        type="background"
        id="background"
        paint={{
          // React Native image sources are converted to strings by the native bridge
          "background-pattern": gridPattern as unknown as string,
        }}
      />

      <GeoJSONSource
        id="smiley-source"
        data={smileyFeatureCollection as FeatureCollection}
      >
        <Layer
          type="fill"
          id="smiley-fill"
          layout={{
            visibility: "visible",
          }}
          paint={{
            "fill-antialias": true,
            "fill-color": "white",
            "fill-outline-color": "rgba(255, 255, 255, 0.84)",
          }}
        />
      </GeoJSONSource>
    </Map>
  );
}
