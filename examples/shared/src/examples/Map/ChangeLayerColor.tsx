import { Layer, Map } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ChangeLayerColor() {
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  return (
    <>
      <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
        {!!backgroundColor && (
          <Layer
            type="background"
            id="background"
            paint={{ "background-color": backgroundColor }}
          />
        )}
      </Map>

      <Bubble
        onPress={() => {
          const color = `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")}`;
          setBackgroundColor(color);
        }}
      >
        <Text>Paint Water</Text>
      </Bubble>
    </>
  );
}
