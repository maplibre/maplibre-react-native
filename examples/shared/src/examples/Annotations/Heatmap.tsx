import {
  HeatmapLayer,
  MapView,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";

import earthquakesData from "@/assets/geojson/earthquakes.json";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Heatmap() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <GeoJSONSource
        id="earthquakes"
        data={earthquakesData as GeoJSON.FeatureCollection}
      >
        <HeatmapLayer
          id="earthquakes"
          sourceID="earthquakes"
          style={{
            heatmapColor: [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
          }}
        />
      </GeoJSONSource>
    </MapView>
  );
}
