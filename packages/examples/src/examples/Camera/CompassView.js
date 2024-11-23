import { MapView, Camera } from "@maplibre/maplibre-react-native";
import React from "react";

import Page from "../../components/Page";
import sheet from "../../styles/sheet";

function CompassView() {
  return (
    <Page>
      <MapView
        style={sheet.matchParent}
        compassEnabled
        logoEnabled={false}
        compassViewPosition={2}
      >
        <Camera heading={21} />
      </MapView>
    </Page>
  );
}

export default CompassView;
