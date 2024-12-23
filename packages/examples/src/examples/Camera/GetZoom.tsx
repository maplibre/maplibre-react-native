import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

export function GetZoom() {
  const [zoom, setZoom] = useState<number>();
  const mapViewRef = useRef<MapViewRef>(null);

  return (
    <>
      <MapView
        ref={mapViewRef}
        onRegionDidChange={async () => {
          setZoom(await mapViewRef.current?.getZoom());
        }}
        style={sheet.matchParent}
      />
      <Bubble>
        <Text>Zoom: {zoom}</Text>
      </Bubble>
    </>
  );
}
