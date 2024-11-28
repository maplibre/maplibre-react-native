import MapLibreGL from "@maplibre/maplibre-react-native";
import { useState } from "react";

import TabBarPage from "../../components/TabBarPage";
import { OSM_RASTER_STYLE } from "../../constants/OSM_RASTER_STYLE";
import { sheet } from "../../styles/sheet";

const OPTIONS = [0, 0.25, 0.5, 0.75, 1];
const DEFAULT_OPTION = 4;

export default function OpenStreetMapRasterTiles() {
  const [value, setValue] = useState(OPTIONS[DEFAULT_OPTION]);

  return (
    <TabBarPage
      defaultValue={DEFAULT_OPTION}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(_index, data) => setValue(data)}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.RasterSource
          id="osm-raster-source"
          tileUrlTemplates={OSM_RASTER_STYLE.sources.osm.tiles}
          {...OSM_RASTER_STYLE.sources.osm}
        >
          <MapLibreGL.RasterLayer
            id="osm-raster-layer"
            style={{ rasterOpacity: value }}
          />
        </MapLibreGL.RasterSource>
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
