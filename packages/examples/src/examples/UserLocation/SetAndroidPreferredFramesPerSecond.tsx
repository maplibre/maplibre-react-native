import MapLibreGL from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import sheet from "../../styles/sheet";
import TabBarPage from "../common/TabBarPage";

const OPTIONS = [5, 10, 15].map((data) => ({ label: data + " FPS", data }));

export default function SetAndroidPreferredFramesPerSecond() {
  const [androidPreferredFramesPerSecond, setAndroidPreferredFramesPerSecond] =
    useState(OPTIONS[0]?.data);

  useEffect(() => {
    MapLibreGL.locationManager.start();

    return () => {
      MapLibreGL.locationManager.stop();
    };
  }, []);

  return (
    <TabBarPage
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setAndroidPreferredFramesPerSecond(data);
      }}
    >
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera followZoomLevel={16} followUserLocation />

        <MapLibreGL.UserLocation
          animated
          renderMode="native"
          androidPreferredFramesPerSecond={androidPreferredFramesPerSecond}
        />
      </MapLibreGL.MapView>
    </TabBarPage>
  );
}
