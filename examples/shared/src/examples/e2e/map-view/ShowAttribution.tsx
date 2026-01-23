import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button } from "react-native";

import { Bubble } from "@/components/Bubble";

export function ShowAttribution() {
  const mapViewRef = useRef<MapViewRef>(null);

  return (
    <>
      <MapView ref={mapViewRef} testID="map-view" />
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
