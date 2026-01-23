import {
  Camera,
  FillExtrusionLayer,
  type FillExtrusionLayerStyle,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import indoor3DFeatureCollection from "@/assets/geojson/indoor-3d.json";
import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const OPTIONS = [-180, -90, 0, 90, 180];

const layerStyles: { building: FillExtrusionLayerStyle } = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
    fillExtrusionColorTransition: { duration: 2000, delay: 0 },
  },
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
      <MapView
        mapStyle={MAPLIBRE_DEMO_STYLE}
        light={{ position: [5, 90, value] }}
      >
        <Camera
          zoom={16}
          pitch={40}
          bearing={20}
          center={[-87.61694, 41.86625]}
        />

        <ShapeSource
          id="indoorBuildingSource"
          data={indoor3DFeatureCollection as GeoJSON.FeatureCollection}
        >
          <FillExtrusionLayer id="building3d" style={layerStyles.building} />
        </ShapeSource>
      </MapView>
    </TabBarView>
  );
}
