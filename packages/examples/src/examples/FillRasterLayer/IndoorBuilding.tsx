import MapLibreGL, {
  type FillExtrusionLayerStyle,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import indoor3DFeatureCollection from "../../assets/geojson/indoor-3d.json";
import TabBarView from "../../components/TabBarView";
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

export default function IndoorBuilding() {
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
          shape={indoor3DFeatureCollection}
        >
          <MapLibreGL.FillExtrusionLayer
            id="building3d"
            style={layerStyles.building}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </TabBarView>
  );
}
