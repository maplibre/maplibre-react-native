import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import type { NativeViewPadding } from "../../../../../src/components/map-view/NativeMapViewComponent";
import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

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
      <MapView style={sheet.matchParent} contentInset={INSETS[alignment]}>
        <Camera followUserLocation followZoom={6} />
        <UserLocation />
      </MapView>
    </TabBarView>
  );
}
