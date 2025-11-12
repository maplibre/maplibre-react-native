import { Camera, MapView } from "@maplibre/maplibre-react-native";

export function Compass() {
  return (
    <MapView compass>
      <Camera bearing={21} />
    </MapView>
  );
}
