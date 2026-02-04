import { MapView, Layer, RasterSource } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";

const OPTIONS = [0, 0.25, 0.5, 0.75, 1];
const DEFAULT_OPTION = 4;

export function OpenStreetMapRasterTiles() {
  const [value, setValue] = useState(OPTIONS[DEFAULT_OPTION]);

  return (
    <TabBarView
      defaultValue={DEFAULT_OPTION}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(_index, data) => setValue(data)}
    >
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <RasterSource id="osm-raster-source" {...OSM_RASTER_STYLE.sources.osm}>
          <Layer
            type="raster"
            id="osm-raster-layer"
            style={{ rasterOpacity: value }}
          />
        </RasterSource>
      </MapView>
    </TabBarView>
  );
}
