import {
  Camera,
  MapView,
  UserLocation,
  useUserLocation,
} from "@maplibre/maplibre-react-native";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";

export function UserLocationUpdates() {
  const location = useUserLocation();

  return (
    <>
      <MapView>
        <Camera trackUserLocation="default" zoom={16} />
        <UserLocation />
      </MapView>

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
