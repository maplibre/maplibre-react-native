import { Camera, MapView } from "@maplibre/maplibre-react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Compass() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE} compass>
      <Camera bearing={21} />
    </MapView>
  );
}
