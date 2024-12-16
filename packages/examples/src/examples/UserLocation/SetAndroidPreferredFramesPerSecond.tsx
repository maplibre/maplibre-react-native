import {
  Camera,
  locationManager,
  MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import TabBarView from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

const OPTIONS = [5, 10, 15].map((data) => ({ label: data + " FPS", data }));

export default function SetAndroidPreferredFramesPerSecond() {
  const [androidPreferredFramesPerSecond, setAndroidPreferredFramesPerSecond] =
    useState(OPTIONS[0]?.data);

  useEffect(() => {
    locationManager.start();

    return () => {
      locationManager.stop();
    };
  }, []);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setAndroidPreferredFramesPerSecond(data);
      }}
    >
      <MapView style={sheet.matchParent}>
        <Camera followZoomLevel={16} followUserLocation />

        <UserLocation
          animated
          renderMode="native"
          androidPreferredFramesPerSecond={androidPreferredFramesPerSecond}
        />
      </MapView>
    </TabBarView>
  );
}
