import { Map, Layer, RasterSource } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";

// Test case for #1267: switching between layer WITH style and WITHOUT style
// crashes on iOS New Architecture due to NSNull handling
const OPTIONS = ["styled", "unstyled"] as const;

export function OpenStreetMapRasterTiles() {
  const [mode, setMode] = useState<(typeof OPTIONS)[number]>("styled");

  return (
    <TabBarView
      defaultValue={0}
      options={OPTIONS.map((option) => ({
        label: option,
        data: option,
      }))}
      onOptionPress={(_index, data) => setMode(data)}
    >
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <RasterSource id="osm-raster-source" {...OSM_RASTER_STYLE.sources.osm}>
          <Layer
            key={mode}
            type="raster"
            id="osm-raster-layer"
            paint={mode === "styled" ? { "raster-opacity": 0.2 } : undefined}
          />
        </RasterSource>
      </Map>
    </TabBarView>
  );
}
