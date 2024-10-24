import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useState } from "react";

import sheet from "../../styles/sheet";
import { SF_OFFICE_COORDINATE } from "../../utils";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = [0, 0.25, 0.5, 0.75, 1];
const DEFAULT_OPTION = 4;

export default function WatercolorRasterTiles() {
  const [value, setValue] = useState(OPTIONS[DEFAULT_OPTION]);

  const rasterSourceProps = {
    id: "stamenWatercolorSource",
    tileUrlTemplates: [
      "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
    ],
    tileSize: 256,
  };

  return (
    <TabBarPage
      defaultValue={DEFAULT_OPTION}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(index, data) => setValue(data)}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera
          zoomLevel={16}
          centerCoordinate={SF_OFFICE_COORDINATE}
        />

        <MapLibreGL.RasterSource {...rasterSourceProps}>
          <MapLibreGL.RasterLayer
            id="stamenWatercolorLayer"
            sourceID="stamenWatercolorSource"
            style={{ rasterOpacity: value }}
          />
        </MapLibreGL.RasterSource>
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
