import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

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
      <MapView style={sheet.matchParent} tintColor={tintColor}>
        <Camera zoom={6} trackUserLocation="heading" />

        <UserLocation renderMode="native" androidRenderMode="compass" />
      </MapView>
    </TabBarView>
  );
}
