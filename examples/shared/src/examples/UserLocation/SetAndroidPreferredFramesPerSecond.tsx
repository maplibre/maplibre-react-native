import {
  Camera,
  LocationManager,
  MapView,
  NativeUserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import { TabBarView } from "@/components/TabBarView";

const OPTIONS = [5, 10, 15].map((data) => ({ label: data + " FPS", data }));

export function SetAndroidPreferredFramesPerSecond() {
  const [androidPreferredFramesPerSecond, setAndroidPreferredFramesPerSecond] =
    useState(OPTIONS[0]?.data);

  useEffect(() => {
    LocationManager.start();

    return () => {
      LocationManager.stop();
    };
  }, []);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setAndroidPreferredFramesPerSecond(data);
      }}
    >
      <MapView>
        <Camera zoom={16} trackUserLocation="default" />

        <NativeUserLocation
          androidPreferredFramesPerSecond={androidPreferredFramesPerSecond}
        />
      </MapView>
    </TabBarView>
  );
}
