import { MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import MapLibreDemoTilesBlue from "../../assets/styles/maplibre-demo-tiles-blue.json";
import MapLibreDemoTilesWhite from "../../assets/styles/maplibre-demo-tiles-white.json";

import { Bubble } from "@/components/Bubble";

export function LocalStyleJSON() {
  const [color, setColor] = useState<"blue" | "white">("blue");

  return (
    <>
      <MapView
        mapStyle={
          { blue: MapLibreDemoTilesBlue, white: MapLibreDemoTilesWhite }[color]
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
