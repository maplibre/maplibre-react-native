import {
  Camera,
  MapView,
  type MapViewRef,
  type LngLat,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { EU_CENTER_COORDINATES } from "@/constants/GEOMETRIES";

export function GetCenter() {
  const [center, setCenter] = useState<LngLat | undefined>();
  const mapViewRef = useRef<MapViewRef>(null);

  const onRegionDidChange = async () => {
    if (mapViewRef.current) {
      const newCenter = await mapViewRef.current.getCenter();
      setCenter(newCenter);
    }
  };

  return (
    <>
      <MapView ref={mapViewRef} onRegionDidChange={onRegionDidChange}>
        <Camera zoom={9} center={EU_CENTER_COORDINATES} />
      </MapView>

      <Bubble>
        <Text>Center</Text>
        <Text>{center?.[0] ?? "–"}</Text>
        <Text>{center?.[1] ?? "–"}</Text>
      </Bubble>
    </>
  );
}
