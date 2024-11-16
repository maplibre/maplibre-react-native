import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useState } from "react";

import indoorMapGeoJSON from "../../assets/indoor_3d_map.json";
import sheet from "../../styles/sheet";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = [-180, -90, 0, 90, 180];

const layerStyles: { building: MapLibreGL.FillExtrusionLayerStyle } = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
    fillExtrusionColorTransition: { duration: 2000, delay: 0 },
  },
};

export default function IndoorBuilding() {
  const [value, setValue] = useState(-90);

  return (
    <TabBarPage
      defaultValue={1}
      options={OPTIONS.map((option) => ({
        label: option.toString(),
        data: option,
      }))}
      onOptionPress={(index, data) => setValue(data)}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera
          zoomLevel={16}
          pitch={40}
          heading={20}
          centerCoordinate={[-87.61694, 41.86625]}
        />

        <MapLibreGL.Light id="light" style={{ position: [5, 90, value] }} />

        <MapLibreGL.ShapeSource
          id="indoorBuildingSource"
          // @ts-ignore
          shape={indoorMapGeoJSON}
        >
          <MapLibreGL.FillExtrusionLayer
            id="building3d"
            style={layerStyles.building}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
