import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

export function SetPitch() {
  const [pitch, setPitch] = useState(0);

  return (
    <TabBarView
      defaultValue={0}
      options={[
        { label: "0", data: 0 },
        { label: "15", data: 15 },
        { label: "30", data: 30 },
        { label: "45", data: 45 },
        { label: "60", data: 60 },
      ]}
      onOptionPress={(_, data) => setPitch(data)}
    >
      <MapView style={sheet.matchParent}>
        <Camera pitch={pitch} duration={500} easing="ease" />
      </MapView>
    </TabBarView>
  );
}
