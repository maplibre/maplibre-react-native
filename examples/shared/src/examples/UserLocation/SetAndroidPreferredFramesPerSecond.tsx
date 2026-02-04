import {
  Camera,
  LocationManager,
  Map,
  NativeUserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

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
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera zoom={16} trackUserLocation="default" />

        <NativeUserLocation
          androidPreferredFramesPerSecond={androidPreferredFramesPerSecond}
        />
      </Map>
    </TabBarView>
  );
}
