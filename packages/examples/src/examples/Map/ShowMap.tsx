import { MapView } from "@maplibre/maplibre-react-native";

import { sheet } from "../../styles/sheet";

export default function ShowMap() {
  return <MapView style={sheet.matchParent} />;
}
