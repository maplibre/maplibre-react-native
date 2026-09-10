import { Camera, Map, UserLocation } from "@maplibre/maplibre-react-native";
import type { MapRef, ViewPadding } from "@maplibre/maplibre-react-native";
import { useRef } from "react";

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
  const mapRef = useRef<MapRef>(null);

  return (
    <TabBarView
      defaultValue={Object.values(Alignment).indexOf(Alignment.Center)}
      options={Object.values(Alignment).map((alignmentValue) => ({
        label: alignmentValue,
        data: alignmentValue,
      }))}
      onOptionPress={async (_index, data) => {
        await mapRef.current?.setContentInset(INSETS[data] ?? {}, {
          animated: true,
        });
      }}
    >
      <Map ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera trackUserLocation="default" zoom={6} />
        <UserLocation />
      </Map>
    </TabBarView>
  );
}
