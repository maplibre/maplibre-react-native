import { Map, type MapRef } from "@maplibre/maplibre-react-native";
import { useRef } from "react";
import { Button } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ShowAttribution() {
  const mapRef = useRef<MapRef>(null);

  return (
    <>
      <Map ref={mapRef} testID="map-view" mapStyle={MAPLIBRE_DEMO_STYLE} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            await mapRef.current?.showAttribution();
          }}
        />
      </Bubble>
    </>
  );
}
