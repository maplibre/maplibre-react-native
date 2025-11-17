import {
  Camera,
  MapView,
  type MapViewRef,
  type ViewState,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { EU_CENTER_COORDINATES } from "../../constants/GEOMETRIES";

export function GetCenter() {
  const [center, setCenter] = useState<
    Pick<ViewState, "longitude" | "latitude"> | undefined
  >();
  const mapRef = useRef<MapViewRef>(null);

  const onRegionDidChange = async () => {
    if (mapRef.current) {
      const newCenter = await mapRef.current.getCenter();
      setCenter(newCenter);
    }
  };

  return (
    <>
      <MapView ref={mapRef} onRegionDidChange={onRegionDidChange}>
        <Camera
          zoom={9}
          longitude={EU_CENTER_COORDINATES[0]}
          latitude={EU_CENTER_COORDINATES[1]}
        />
      </MapView>

      <Bubble>
        <Text>Center</Text>
        <Text>{center?.longitude ?? "–"}</Text>
        <Text>{center?.latitude ?? "–"}</Text>
      </Bubble>
    </>
  );
}
