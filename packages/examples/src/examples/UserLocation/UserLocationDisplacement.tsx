import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";

import sheet from "../../styles/sheet";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = [0, 5, 10].map((data) => ({ label: data + " Meter", data }));

export default function UserLocationDisplacement() {
  const [minDisplacement, setMinDisplacement] = useState(OPTIONS[0].data);

  useEffect(() => {
    MapLibreGL.locationManager.start();

    return () => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  return (
    <TabBarPage
      options={OPTIONS}
      onOptionPress={(index, data) => {
        setMinDisplacement(data);
      }}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera
          followZoomLevel={16}
          followUserMode={MapLibreGL.UserTrackingMode.FollowWithHeading}
          followUserLocation
        />

        <MapLibreGL.UserLocation minDisplacement={minDisplacement} />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
