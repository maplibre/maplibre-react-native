import { MapView, type PressEvent } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";

export function ShowClick() {
  const [pressEvent, setPressEvent] = useState<PressEvent>();

  return (
    <>
      <MapView
        onPress={(event) => {
          setPressEvent(event.nativeEvent);
        }}
      />
      {!pressEvent ? (
        <Bubble>
          <Text>Click the map!</Text>
        </Bubble>
      ) : (
        <Bubble>
          <Text>Longitude: {pressEvent.lngLat[0]}</Text>
          <Text>Latitude: {pressEvent.lngLat[1]}</Text>
          <Text>Screen Point X: {pressEvent.point[0]}</Text>
          <Text>Screen Point Y: {pressEvent.point[1]}</Text>
        </Bubble>
      )}
    </>
  );
}
