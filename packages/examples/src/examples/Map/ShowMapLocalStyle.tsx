import MapLibreGL from "@maplibre/maplibre-react-native";

import MapLibreDemoTilesBlue from "../../assets/styles/maplibre-demo-tiles-blue.json";
import Page from "../../components/Page";
import { sheet } from "../../styles/sheet";

const STYLE = JSON.stringify(MapLibreDemoTilesBlue);

export default function ShowMap() {
  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent} styleJSON={STYLE} />
    </Page>
  );
}
