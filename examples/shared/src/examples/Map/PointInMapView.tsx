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
          if (event.geometry.type === "Point") {
            const pointInView = await mapViewRef.current?.getPointInView(
              event.geometry.coordinates,
            );

            setPoint(pointInView);
          }
        }}
        style={styles.mapView}
      >
        <Camera zoomLevel={9} centerCoordinate={[-73.970895, 40.723279]} />
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
