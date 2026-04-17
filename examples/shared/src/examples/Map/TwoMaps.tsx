import { Layer, Map, GeoJSONSource } from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "@/assets/geojson/smiley.json";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const LAYER_STYLES = [
  {
    "fill-antialias": true,
    "fill-color": "white",
    "fill-outline-color": "rgba(255, 255, 255, 0.84)",
  },
  {
    "fill-antialias": true,
    "fill-color": "black",
    "fill-outline-color": "rgba(0, 0, 0, 0.84)",
  },
];

export function TwoMaps() {
  return (
    <>
      {LAYER_STYLES.map((style, index) => {
        return (
          <Map key={index} mapStyle={MAPLIBRE_DEMO_STYLE}>
            <GeoJSONSource data={smileyFeatureCollection as FeatureCollection}>
              <Layer type="fill" id="smileyFaceFill" paint={style} />
            </GeoJSONSource>
          </Map>
        );
      })}
    </>
  );
}
