import {
  Camera,
  type LngLat,
  MapView,
  type MapViewRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = {
  mapView: { flex: 1 },
};

export function ProjectUnproject() {
  const mapViewRef = useRef<MapViewRef>(null);

  const [coordinates, setCoordinates] = useState<LngLat>();
  const [point, setPoint] = useState<PixelPoint>();

  return (
    <>
      <MapView
        ref={mapViewRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          /*
           * The event actually contains both coordinates and pixel point,
           * project/unproject is only used for demonstration
           */

          event.persist();

          setCoordinates(
            await mapViewRef.current?.unproject(event.nativeEvent.point),
          );

          setPoint(await mapViewRef.current?.project(event.nativeEvent.lngLat));
        }}
        style={styles.mapView}
      >
        <Camera />
      </MapView>

      <Bubble>
        {coordinates && point ? (
          <>
            <Text>Longitude: {coordinates[0]}</Text>
            <Text>Latitude: {coordinates[1]}</Text>
            <Text>X: {point[0]}</Text>
            <Text>Y: {point[1]}</Text>
          </>
        ) : (
          <Text>Touch map to see pixel point</Text>
        )}
      </Bubble>
    </>
  );
}
