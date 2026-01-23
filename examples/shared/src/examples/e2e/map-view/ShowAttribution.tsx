import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ShowAttribution() {
  const mapViewRef = useRef<MapViewRef>(null);

  return (
    <>
      <MapView
        ref={mapViewRef}
        testID="map-view"
        mapStyle={MAPLIBRE_DEMO_STYLE}
      />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            await mapViewRef.current?.showAttribution();
          }}
        />
      </Bubble>
    </>
  );
}
