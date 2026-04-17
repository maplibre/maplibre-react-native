import {
  Camera,
  Map,
  UserLocation,
  useCurrentPosition,
} from "@maplibre/maplibre-react-native";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { OSM_VECTOR_STYLE } from "@/constants/OSM_VECTOR_STYLE";

export function UserLocationUpdates() {
  const location = useCurrentPosition();

  return (
    <>
      <Map
        mapStyle={OSM_VECTOR_STYLE}
        onRegionDidChange={(event) => {
          console.log("Region did change:", event.nativeEvent.zoom);
        }}
      >
        <Camera trackUserLocation="default" zoom={16} />
        <UserLocation accuracy heading />
      </Map>

      {location && (
        <Bubble>
          <Text>Timestamp: {location.timestamp}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Accuracy: {location.coords.accuracy}</Text>
          <Text>Altitude: {location.coords.altitude}</Text>
          <Text>Altitude Accuracy: {location.coords.altitudeAccuracy}</Text>
          <Text>Heading: {location.coords.heading}</Text>
          <Text>Speed: {location.coords.speed}</Text>
        </Bubble>
      )}
    </>
  );
}
