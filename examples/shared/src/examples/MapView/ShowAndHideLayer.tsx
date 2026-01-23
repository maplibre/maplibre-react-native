import { Camera, FillLayer, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ShowAndHideLayer() {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
        <Camera initialViewState={{ zoom: 2 }} />
        <FillLayer
          id="countries-label"
          style={{ visibility: show ? "visible" : "none" }}
        />
      </MapView>

      <Bubble
        onPress={() => {
          setShow((prev) => !prev);
        }}
      >
        <Text>{show ? "Hide Country Labels" : "Show Country Labels"}</Text>
      </Bubble>
    </>
  );
}
