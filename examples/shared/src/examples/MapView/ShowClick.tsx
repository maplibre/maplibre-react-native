import { MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

export function ShowClick() {
  const [pressEvent, setPressEvent] = useState<any>();

  return (
    <>
      <MapView
        style={sheet.matchParent}
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
          <Text>Longitude: {pressEvent.longitude}</Text>
          <Text>Latitude: {pressEvent.latitude}</Text>
          <Text>Screen Point X: {pressEvent.locationX}</Text>
          <Text>Screen Point Y: {pressEvent.locationY}</Text>
        </Bubble>
      )}
    </>
  );
}
