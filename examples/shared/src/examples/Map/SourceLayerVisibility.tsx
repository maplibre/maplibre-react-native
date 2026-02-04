import { Map, type MapRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function SourceLayerVisibility() {
  const mapRef = useRef<MapRef>(null);
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Map ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE} />
      <Bubble
        onPress={() => {
          mapRef.current?.setSourceVisibility(
            !visible,
            "maplibre",
            "countries",
          );

          setVisible((prevState) => !prevState);
        }}
      >
        <Text>{`${visible ? "Hide" : "Show"} Countries`}</Text>
      </Bubble>
    </>
  );
}
