import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

enum Alignment {
  Top = "TOP",
  Center = "CENTER",
  Bottom = "BOTTOM",
}
const INSETS: Record<Alignment, number[] | number> = {
  [Alignment.Top]: [0, 0, 300, 0],
  [Alignment.Center]: 0,
  [Alignment.Bottom]: [300, 0, 0, 0],
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
        <Camera followUserLocation followZoomLevel={6} />
        <UserLocation />
      </MapView>
    </TabBarView>
  );
}
