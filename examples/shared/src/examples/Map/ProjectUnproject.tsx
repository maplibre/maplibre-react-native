import {
  Camera,
  type LngLat,
  Map,
  type MapRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ProjectUnproject() {
  const mapRef = useRef<MapRef>(null);

  const [coordinates, setCoordinates] = useState<LngLat>();
  const [point, setPoint] = useState<PixelPoint>();

  return (
    <>
      <Map
        ref={mapRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          /*
           * The event actually contains both coordinates and pixel point,
           * project/unproject is only used for demonstration
           */
          event.persist();

          setCoordinates(
            await mapRef.current?.unproject(event.nativeEvent.point),
          );

          setPoint(await mapRef.current?.project(event.nativeEvent.lngLat));
        }}
      >
        <Camera />
      </Map>

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
