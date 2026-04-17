import {
  Camera,
  type LngLat,
  Map,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";

import { TabBarView } from "@/components/TabBarView";
import {
  EU_CENTER_COORDINATES,
  US_CENTER_COORDINATES,
} from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const ZERO_ZERO: LngLat = [0, 0];

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
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera zoom={6} easing="fly" duration={6000} center={location} />
        <UserLocation />
      </Map>
    </TabBarView>
  );
}
