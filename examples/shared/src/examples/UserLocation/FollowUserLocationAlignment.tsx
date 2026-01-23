import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import type { ViewPadding } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

enum Alignment {
  Top = "TOP",
  Center = "CENTER",
  Bottom = "BOTTOM",
}
const INSETS: Record<Alignment, ViewPadding | undefined> = {
  [Alignment.Top]: { bottom: 300 },
  [Alignment.Center]: undefined,
  [Alignment.Bottom]: { top: 300 },
};

export function FollowUserLocationAlignment() {
  const [alignment, setAlignment] = useState<Alignment>(Alignment.Center);

  return (
    <TabBarView
      defaultValue={Object.values(Alignment).indexOf(Alignment.Center)}
      options={Object.values(Alignment).map((alignmentValue) => ({
        label: alignmentValue,
        data: alignmentValue,
      }))}
      onOptionPress={(_index, data) => {
        setAlignment(data);
      }}
    >
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE} contentInset={INSETS[alignment]}>
        <Camera trackUserLocation="default" zoom={6} />
        <UserLocation />
      </MapView>
    </TabBarView>
  );
}
