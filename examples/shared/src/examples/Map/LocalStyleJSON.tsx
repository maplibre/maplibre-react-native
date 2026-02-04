import { Map } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import MapLibreDemoStyleBlue from "@/assets/styles/maplibre-demo-style-blue.json";
import MapLibreDemoStyleWhite from "@/assets/styles/maplibre-demo-style-white.json";
import { Bubble } from "@/components/Bubble";

export function LocalStyleJSON() {
  const [color, setColor] = useState<"blue" | "white">("blue");

  return (
    <>
      <Map
        mapStyle={
          { blue: MapLibreDemoStyleBlue, white: MapLibreDemoStyleWhite }[color]
        }
      />
      <Bubble
        onPress={() =>
          setColor((prevState) => {
            return ({ blue: "white", white: "blue" } as const)[prevState];
          })
        }
      >
        <Text>Switch Style JSON</Text>
      </Bubble>
    </>
  );
}
