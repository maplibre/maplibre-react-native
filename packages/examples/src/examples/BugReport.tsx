import { MapView } from "@maplibre/maplibre-react-native";

import { sheet } from "../styles/sheet";

export default function BugReport() {
  return (
    <MapView style={sheet.matchParent}>
      {/* Reproduce your Bug here! */}
    </MapView>
  );
}
