import {
  CircleLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Button } from "react-native";

import Page from "../components/Page";
import { colors } from "../styles/colors";
import { sheet } from "../styles/sheet";

export default function BugReport() {
  const [radius, setRadius] = useState(8);

  return (
    <Page safeAreaView>
      <MapView style={sheet.matchParent}>
        <ShapeSource
          id="circle-source"
          shape={{ type: "Point", coordinates: [0, 0] }}
        >
          <CircleLayer
            id="circle-layer"
            style={{
              circleColor: colors.blue,
              circleRadiusTransition: {
                duration: 5000,
                delay: 0,
              },
              circleRadius: radius,
            }}
          />
        </ShapeSource>
      </MapView>
      <Button
        title="Grow"
        onPress={() => setRadius((prevState) => prevState + 4)}
      />
    </Page>
  );
}
