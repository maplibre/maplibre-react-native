import { MapView } from "@maplibre/maplibre-react-native";

export function PMTilesMapStyle() {
  return (
    <MapView mapStyle="https://raw.githubusercontent.com/wipfli/foursquare-os-places-pmtiles/refs/heads/main/style.json" />
  );
}
