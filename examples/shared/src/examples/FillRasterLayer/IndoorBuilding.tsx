import {
  Camera,
  FillExtrusionLayer,
  type FillExtrusionLayerStyle,
  Light,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import indoor3DFeatureCollection from "../../assets/geojson/indoor-3d.json";
import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

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

export function IndoorBuilding() {
  const [value, setValue] = useState(-90);

  return (
    <TabBarView
      defaultValue={1}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(_index, data) => setValue(data)}
    >
      <MapView style={sheet.matchParent}>
        <Camera
          zoomLevel={16}
          pitch={40}
          heading={20}
          centerCoordinate={[-87.61694, 41.86625]}
        />

        <Light id="light" style={{ position: [5, 90, value] }} />

        <ShapeSource
          id="indoorBuildingSource"
          shape={indoor3DFeatureCollection as GeoJSON.FeatureCollection}
        >
          <FillExtrusionLayer id="building3d" style={layerStyles.building} />
        </ShapeSource>
      </MapView>
    </TabBarView>
  );
}
