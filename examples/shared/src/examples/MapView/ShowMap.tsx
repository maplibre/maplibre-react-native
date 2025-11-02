import { MapView } from "@maplibre/maplibre-react-native";

import { sheet } from "../../styles/sheet";

export function ShowMap() {
  return <MapView style={sheet.matchParent} />;
}
