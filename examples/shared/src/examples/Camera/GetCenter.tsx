import {
  Camera,
  Map,
  type MapRef,
  type LngLat,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { EU_CENTER_COORDINATES } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GetCenter() {
  const [center, setCenter] = useState<LngLat | undefined>();
  const mapRef = useRef<MapRef>(null);

  const onRegionDidChange = async () => {
    if (mapRef.current) {
      const newCenter = await mapRef.current.getCenter();
      setCenter(newCenter);
    }
  };

  return (
    <>
      <Map
        ref={mapRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onRegionDidChange={onRegionDidChange}
      >
        <Camera zoom={9} center={EU_CENTER_COORDINATES} />
      </Map>

      <Bubble>
        <Text>Center</Text>
        <Text>{center?.[0] ?? "–"}</Text>
        <Text>{center?.[1] ?? "–"}</Text>
      </Bubble>
    </>
  );
}
