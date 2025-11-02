import { Camera, MapView } from "@maplibre/maplibre-react-native";

import { sheet } from "../../styles/sheet";

export function Compass() {
  return (
    <MapView style={sheet.matchParent} compass>
      <Camera bearing={21} />
    </MapView>
  );
}
