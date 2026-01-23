import { MapView } from "@maplibre/maplibre-react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function AndroidViewTexture() {
  return (
    <MapView
      testID="map-view"
      mapStyle={MAPLIBRE_DEMO_STYLE}
      androidView="texture"
    />
  );
}
