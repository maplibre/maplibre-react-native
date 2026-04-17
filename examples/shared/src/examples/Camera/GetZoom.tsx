import { Map, type MapRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GetZoom() {
  const [zoom, setZoom] = useState<number>();
  const mapRef = useRef<MapRef>(null);

  return (
    <>
      <Map
        mapStyle={MAPLIBRE_DEMO_STYLE}
        ref={mapRef}
        onRegionDidChange={async () => {
          setZoom(await mapRef.current?.getZoom());
        }}
      />
      <Bubble>
        <Text>Zoom: {zoom}</Text>
      </Bubble>
    </>
  );
}
