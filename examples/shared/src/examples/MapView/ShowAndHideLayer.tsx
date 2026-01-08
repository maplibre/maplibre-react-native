import { Camera, FillLayer, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";

const styles = {
  mapView: { flex: 1 },
};

export function ShowAndHideLayer() {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <MapView style={styles.mapView}>
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
