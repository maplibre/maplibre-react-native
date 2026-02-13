import type { FillExtrusionLayerSpecification } from "@maplibre/maplibre-gl-style-spec";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import indoor3DFeatureCollection from "@/assets/geojson/indoor-3d.json";
import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const OPTIONS = [-180, -90, 0, 90, 180];

const FILL_EXTRUSION_LAYER_PAINT: FillExtrusionLayerSpecification["paint"] = {
  "fill-extrusion-opacity": 0.5,
  "fill-extrusion-height": ["get", "height"],
  "fill-extrusion-base": ["get", "base_height"],
  "fill-extrusion-color": ["get", "color"],
  "fill-extrusion-color-transition": { duration: 2000, delay: 0 },
};

const DEFAULT_OPTION = 1;
const DEFAULT_VALUE = OPTIONS[DEFAULT_OPTION]!;

export function IndoorBuilding() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <TabBarView
      defaultValue={DEFAULT_OPTION}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(_index, data) => setValue(data)}
    >
      <Map mapStyle={MAPLIBRE_DEMO_STYLE} light={{ position: [5, 90, value] }}>
        <Camera
          zoom={16}
          pitch={40}
          bearing={20}
          center={[-87.61694, 41.86625]}
        />

        <GeoJSONSource
          id="indoorBuildingSource"
          data={indoor3DFeatureCollection as GeoJSON.FeatureCollection}
        >
          <Layer
            type="fill-extrusion"
            id="building3d"
            paint={FILL_EXTRUSION_LAYER_PAINT}
          />
        </GeoJSONSource>
      </Map>
    </TabBarView>
  );
}
