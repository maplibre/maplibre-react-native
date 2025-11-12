import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";

const OPTIONS = ["red", "yellow", "green"].map((data) => ({
  label: data,
  data,
}));

export function SetTintColor() {
  const [tintColor, setTintColor] = useState(OPTIONS[0]!.data);

  return (
    <TabBarView
      options={OPTIONS}
      onOptionPress={(_index, data) => {
        setTintColor(data);
      }}
    >
      <MapView tintColor={tintColor}>
        <Camera zoom={6} trackUserLocation="heading" />

        <UserLocation renderMode="native" androidRenderMode="compass" />
      </MapView>
    </TabBarView>
  );
}
