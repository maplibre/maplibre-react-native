import MapLibreGL from "@maplibre/maplibre-react-native";

import Page from "../../components/Page";
import { sheet } from "../../styles/sheet";

export default function ShowMap() {
  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent} />
    </Page>
  );
}
