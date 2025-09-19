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

export function PointInMapView() {
  const mapViewRef = useRef<MapViewRef>(null);

  const [point, setPoint] = useState<[number, number]>();

  return (
    <>
      <MapView
        ref={mapViewRef}
        onPress={async (event) => {
          const pointInView = await mapViewRef.current?.getPointInView([
            event.nativeEvent.longitude,
            event.nativeEvent.latitude,
          ]);

          setPoint(pointInView);
        }}
        style={styles.mapView}
      >
        <Camera zoom={9} longitude={-73.970895} latitude={40.723279} />
      </MapView>

      <Bubble>
        {point ? (
          <>
            <Text key="x">x: {point[0]}</Text>
            <Text key="y">y: {point[1]}</Text>
          </>
        ) : (
          <Text>Touch map to see xy pixel location</Text>
        )}
      </Bubble>
    </>
  );
}
