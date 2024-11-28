import MapLibreGL from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";

import smileyFeatureCollection from "../../assets/geojson/smiley.json";
import Page from "../../components/Page";
import { sheet } from "../../styles/sheet";

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

export default function TwoMapViews() {
  return (
    <Page>
      {[layerStyles.smileyFaceDark, layerStyles.smileyFaceLight].map(
        (style) => {
          return (
            <MapLibreGL.MapView style={sheet.matchParent}>
              <MapLibreGL.ShapeSource
                id="smileyFaceSource"
                shape={smileyFeatureCollection as FeatureCollection}
              >
                <MapLibreGL.FillLayer id="smileyFaceFill" style={style} />
              </MapLibreGL.ShapeSource>
            </MapLibreGL.MapView>
          );
        },
      )}
    </Page>
  );
}
