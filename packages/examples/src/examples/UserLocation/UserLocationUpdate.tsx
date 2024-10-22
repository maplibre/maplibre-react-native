import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useState } from "react";
import { Text } from "react-native";

import sheet from "../../styles/sheet";
import Bubble from "../common/Bubble";
import Page from "../common/Page";

export default function UserLocationUpdate() {
  const [location, setLocation] = useState<MapLibreGL.Location>();

  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.UserLocation
          onUpdate={(newLocation) => setLocation(newLocation)}
        />
        <MapLibreGL.Camera followUserLocation followZoomLevel={16} />
      </MapLibreGL.MapView>

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
    </Page>
  );
}
