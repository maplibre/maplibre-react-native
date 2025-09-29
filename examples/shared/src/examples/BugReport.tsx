import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
} from "@maplibre/maplibre-react-native";
import { type FeatureCollection } from "geojson";

export function BugReport() {
  const settings = {
    bounds: {
      ne: [17.945307467475175, 55.626240168597775],
      sw: [17.271308406058154, 49.30274838271916],
    },
    padding: {
      paddingTop: 0,
      paddingBottom: 400,
    },
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [17.945307467475175, 55.626240168597775],
            [17.271308406058154, 49.30274838271916],
          ],
          type: "LineString",
        },
      },
    ],
  } as FeatureCollection;

  return (
    <MapView style={{ flex: 1 }}>
      <Camera defaultSettings={settings} />

      <ShapeSource id="geojson" shape={geojson}>
        <LineLayer id="line" style={{ lineColor: "red", lineWidth: 4 }} />
      </ShapeSource>
    </MapView>
  );
}
