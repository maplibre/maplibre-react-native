import { MapView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Text } from "react-native";

import MapLibreDemoTilesBlue from "../../assets/styles/maplibre-demo-tiles-blue.json";
import MapLibreDemoTilesWhite from "../../assets/styles/maplibre-demo-tiles-white.json";
import Bubble from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

const STYLE_BLUE = JSON.stringify(MapLibreDemoTilesBlue);
const STYLE_WHITE = JSON.stringify(MapLibreDemoTilesWhite);

export default function LocalStyleJSON() {
  const [color, setColor] = useState<"blue" | "white">("blue");

  return (
    <>
      <MapView
        style={sheet.matchParent}
        styleJSON={{ blue: STYLE_BLUE, white: STYLE_WHITE }[color]}
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
