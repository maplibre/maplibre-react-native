import { BackgroundLayer, MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import { Bubble } from "@/components/Bubble";

export function ChangeLayerColor() {
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  return (
    <>
      <MapView>
        {!!backgroundColor && (
          <BackgroundLayer id="background" style={{ backgroundColor }} />
        )}
      </MapView>

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
