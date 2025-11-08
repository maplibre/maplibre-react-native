import {
  Camera,
  type GeolocationPosition,
  MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

export function UserLocationUpdate() {
  const [location, setLocation] = useState<GeolocationPosition>();

  return (
    <>
      <MapView
        style={sheet.matchParent}
        mapStyle="https://sgx.geodatenzentrum.de/gdz_basemapworld_vektor/styles/bm_web_wld_col.json"
      >
        <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} />
        <Camera trackUserLocation="default" zoom={16} />
      </MapView>

      <Bubble>
        {location && (
          <>
            <Text>Timestamp: {location.timestamp}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Altitude: {location.coords.altitude}</Text>
            <Text>Heading: {location.coords.heading}</Text>
            <Text>Accuracy: {location.coords.accuracy}</Text>
            <Text>Speed: {location.coords.speed}</Text>
          </>
        )}
      </Bubble>
    </>
  );
}
