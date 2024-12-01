import MapLibreGL from "@maplibre/maplibre-react-native";

import { sheet } from "../../styles/sheet";

export default function ShowMap() {
  return <MapLibreGL.MapView style={sheet.matchParent} />;
}
