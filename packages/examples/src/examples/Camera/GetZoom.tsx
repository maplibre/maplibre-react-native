import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { Text } from "react-native";

import Bubble from "../../components/Bubble";
import Page from "../../components/Page";
import sheet from "../../styles/sheet";

export default function GetZoom() {
  const [zoom, setZoom] = useState<number>();
  const mapViewRef = useRef<MapLibreGL.MapViewRef>(null);

  return (
    <Page>
      <MapLibreGL.MapView
        ref={mapViewRef}
        onRegionDidChange={async () => {
          setZoom(await mapViewRef.current?.getZoom());
        }}
        style={sheet.matchParent}
      />
      <Bubble>
        <Text>Zoom: {zoom}</Text>
      </Bubble>
    </Page>
  );
}
