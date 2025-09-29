import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

export function SetBearing() {
  const [bearing, setBearing] = useState<number>(0);

  return (
    <TabBarView
      defaultValue={0}
      options={[
        { label: "0", data: 0 },
        { label: "90", data: 90 },
        { label: "180", data: 180 },
      ]}
      onOptionPress={(_, data) => {
        setBearing(data);
      }}
    >
      <MapView style={sheet.matchParent}>
        <Camera bearing={bearing} duration={500} easing="ease" />
      </MapView>
    </TabBarView>
  );
}
