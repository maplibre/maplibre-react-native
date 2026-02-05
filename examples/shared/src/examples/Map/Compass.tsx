import { Camera, Map } from "@maplibre/maplibre-react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Compass() {
  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE} compass>
      <Camera bearing={21} />
    </Map>
  );
}
