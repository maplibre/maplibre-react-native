import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "../../components/TabBarView";
import {
  EU_CENTER_COORDINATES,
  US_CENTER_COORDINATES,
} from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

const ZERO_ZERO = [0, 0];

const OPTIONS = [
  { label: "0, 0", data: ZERO_ZERO },
  { label: "EU", data: EU_CENTER_COORDINATES },
  { label: "US", data: US_CENTER_COORDINATES },
];

export function FlyTo() {
  const [location, setLocation] = useState(ZERO_ZERO);

  return (
    <TabBarView
      options={OPTIONS}
      defaultValue={0}
      onOptionPress={(_, data) => {
        setLocation(data);
      }}
    >
      <MapView style={sheet.matchParent}>
        <Camera
          zoom={6}
          easing="fly"
          duration={6000}
          longitude={location[0]}
          latitude={location[1]}
        />
        <UserLocation />
      </MapView>
    </TabBarView>
  );
}
