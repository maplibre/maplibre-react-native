import { MapView } from "@maplibre/maplibre-react-native";

export function PMTilesMapStyle() {
  return (
    <MapView
      style={{ flex: 1 }}
      mapStyle="https://raw.githubusercontent.com/wipfli/foursquare-os-places-pmtiles/refs/heads/main/style.json"
    />
  );
}
