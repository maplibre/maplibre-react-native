import { Layer, Map, GeoJSONSource } from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "@/assets/geojson/smiley.json";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const layerStyles = {
  smileyFaceLight: {
    fillAntialias: true,
    fillColor: "white",
    fillOutlineColor: "rgba(255, 255, 255, 0.84)",
  },
  smileyFaceDark: {
    fillAntialias: true,
    fillColor: "black",
    fillOutlineColor: "rgba(0, 0, 0, 0.84)",
  },
};

export function TwoMaps() {
  return (
    <>
      {[layerStyles.smileyFaceDark, layerStyles.smileyFaceLight].map(
        (style) => {
          return (
            <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
              <GeoJSONSource
                data={smileyFeatureCollection as FeatureCollection}
              >
                <Layer type="fill" id="smileyFaceFill" style={style} />
              </GeoJSONSource>
            </Map>
          );
        },
      )}
    </>
  );
}
