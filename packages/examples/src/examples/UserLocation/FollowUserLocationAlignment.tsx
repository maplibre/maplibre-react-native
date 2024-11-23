import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useState } from "react";

import TabBarPage from "../../components/TabBarPage";
import sheet from "../../styles/sheet";

enum Alignment {
  Top = "TOP",
  Center = "CENTER",
  Bottom = "BOTTOM",
}
const INSETS: Record<Alignment, number[] | number> = {
  [Alignment.Top]: [0, 0, 300, 0],
  [Alignment.Center]: 0,
  [Alignment.Bottom]: [300, 0, 0, 0],
};

export default function FollowUserLocationAlignment() {
  const [alignment, setAlignment] = useState<Alignment>(Alignment.Center);

  return (
    <TabBarPage
      defaultValue={Object.values(Alignment).indexOf(Alignment.Center)}
      options={Object.values(Alignment).map((alignmentValue) => ({
        label: alignmentValue,
        data: alignmentValue,
      }))}
      onOptionPress={(index, data) => {
        setAlignment(data);
      }}
    >
      <MapLibreGL.MapView
        style={sheet.matchParent}
        contentInset={INSETS[alignment]}
      >
        <MapLibreGL.Camera followUserLocation />
        <MapLibreGL.UserLocation />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
