import {
  Camera,
  type CircleLayerSpecification,
  GeoJSONSource,
  Layer,
  Map,
  type SymbolLayerSpecification,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import earthquakesData from "@/assets/geojson/earthquakes.json";
import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const OPTIONS: { label: string; data: number | undefined }[] = [
  { label: "Style's", data: undefined },
  { label: "0", data: 0 },
  { label: "1000", data: 1000 },
];

const clusterPaint: CircleLayerSpecification["paint"] = {
  "circle-color": "#51bbd6",
  "circle-radius": 18,
};

const clusterCountLayout: SymbolLayerSpecification["layout"] = {
  "text-field": ["get", "point_count"],
  "text-size": 12,
};

export function FadeDuration() {
  const [fadeDuration, setFadeDuration] = useState(OPTIONS[0]!.data);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setFadeDuration(data);
      }}
    >
      <Map mapStyle={MAPLIBRE_DEMO_STYLE} fadeDuration={fadeDuration}>
        <Camera zoom={2} />

        <GeoJSONSource
          id="earthquakes"
          data={earthquakesData as unknown as GeoJSON.FeatureCollection}
          cluster
          clusterRadius={50}
        >
          <Layer
            type="circle"
            id="clusters"
            filter={["has", "point_count"]}
            paint={clusterPaint}
          />
          <Layer
            type="symbol"
            id="cluster-count"
            filter={["has", "point_count"]}
            layout={clusterCountLayout}
          />
        </GeoJSONSource>
      </Map>
    </TabBarView>
  );
}
