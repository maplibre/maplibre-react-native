import {
  FillLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

import smileyFeatureCollection from "../../assets/geojson/smiley.json";

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

export function TwoMapViews() {
  return (
    <>
      {[layerStyles.smileyFaceDark, layerStyles.smileyFaceLight].map(
        (style) => {
          return (
            <MapView>
              <ShapeSource
                id="smileyFaceSource"
                data={smileyFeatureCollection as FeatureCollection}
              >
                <FillLayer id="smileyFaceFill" style={style} />
              </ShapeSource>
            </MapView>
          );
        },
      )}
    </>
  );
}
