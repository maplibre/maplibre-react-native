import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useRef, useState } from "react";
import { Text } from "react-native";

import sheet from "../../styles/sheet";
import Bubble from "../common/Bubble";
import Page from "../common/Page";

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
      >
        <MapLibreGL.Camera />
      </MapLibreGL.MapView>

      <Bubble>
        <Text>Zoom: {zoom}</Text>
      </Bubble>
    </Page>
  );
}
