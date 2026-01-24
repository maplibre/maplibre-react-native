import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function SetBearing() {
  const [bearing, setBearing] = useState(0);

  return (
    <TabBarView
      defaultValue={0}
      options={[
        { label: "0", data: 0 },
        { label: "90", data: 90 },
        { label: "180", data: 180 },
      ]}
      onOptionPress={(_, data) => setBearing(data)}
    >
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera bearing={bearing} duration={500} easing="ease" />
      </MapView>
    </TabBarView>
  );
}
