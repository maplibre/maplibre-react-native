import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useState } from "react";

import sheet from "../../styles/sheet";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = ["red", "yellow", "green"].map((data) => ({
  label: data,
  data,
}));

export default function SetTintColor() {
  const [tintColor, setTintColor] = useState(OPTIONS[0].data);

  console.log(tintColor);

  return (
    <TabBarPage
      options={OPTIONS}
      onOptionPress={(index, data) => {
        console.log(data);

        setTintColor(data);
      }}
    >
      <MapLibreGL.MapView style={sheet.matchParent} tintColor={tintColor}>
        <MapLibreGL.Camera
          followZoomLevel={16}
          followUserMode={MapLibreGL.UserTrackingMode.FollowWithHeading}
          followUserLocation
        />

        <MapLibreGL.UserLocation
          renderMode="native"
          androidRenderMode="compass"
        />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
