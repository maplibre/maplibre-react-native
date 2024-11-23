import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";

import sheet from "../../styles/sheet";
import Page from "../common/Page";

export default function ShowMap() {
  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent} />
    </Page>
  );
}
