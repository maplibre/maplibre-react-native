import {
  Camera,
  MapView,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";

const styles = {
  mapView: { flex: 1 },
};

export function ProjectUnproject() {
  const mapViewRef = useRef<MapViewRef>(null);

  const [coordinates, setCoordinates] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [point, setPoint] = useState<{
    locationX: number;
    locationY: number;
  }>();

  return (
    <>
      <MapView
        ref={mapViewRef}
        onPress={async (event) => {
          /*
           * The event actually contains both coordinate and point info,
           * project/unproject is only used for demonstration
           */

          event.persist();

          setCoordinates(
            await mapViewRef.current?.unproject({
              locationX: event.nativeEvent.locationX,
              locationY: event.nativeEvent.locationY,
            }),
          );

          setPoint(
            await mapViewRef.current?.project({
              longitude: event.nativeEvent.longitude,
              latitude: event.nativeEvent.latitude,
            }),
          );
        }}
        style={styles.mapView}
      >
        <Camera />
      </MapView>

      <Bubble>
        {coordinates && point ? (
          <>
            <Text>Longitude: {coordinates.longitude}</Text>
            <Text>Latitude: {coordinates.latitude}</Text>
            <Text>X: {point.locationX}</Text>
            <Text>Y: {point.locationY}</Text>
          </>
        ) : (
          <Text>Touch map to see xy pixel location</Text>
        )}
      </Bubble>
    </>
  );
}
