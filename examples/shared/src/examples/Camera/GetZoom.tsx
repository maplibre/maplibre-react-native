import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GetZoom() {
  const [zoom, setZoom] = useState<number>();
  const mapViewRef = useRef<MapViewRef>(null);

  return (
    <>
      <MapView
        mapStyle={MAPLIBRE_DEMO_STYLE}
        ref={mapViewRef}
        onRegionDidChange={async () => {
          setZoom(await mapViewRef.current?.getZoom());
        }}
      />
      <Bubble>
        <Text>Zoom: {zoom}</Text>
      </Bubble>
    </>
  );
}
