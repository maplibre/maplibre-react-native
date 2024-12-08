import { Camera, MapView } from "@maplibre/maplibre-react-native";
import React from "react";

import { sheet } from "../../styles/sheet";

function CompassView() {
  return (
    <MapView
      style={sheet.matchParent}
      compassEnabled
      logoEnabled={false}
      compassViewPosition={2}
    >
      <Camera heading={21} />
    </MapView>
  );
}

export default CompassView;
