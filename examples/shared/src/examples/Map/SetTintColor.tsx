import {
  Camera,
  Map,
  NativeUserLocation,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

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
      <Map mapStyle={MAPLIBRE_DEMO_STYLE} tintColor={tintColor}>
        <Camera zoom={6} trackUserLocation="heading" />

        <NativeUserLocation mode="heading" />
      </Map>
    </TabBarView>
  );
}
