import { Map } from "@maplibre/maplibre-react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function ShowMap() {
  return <Map mapStyle={MAPLIBRE_DEMO_STYLE} />;
}
