import {
  Images,
  MapView,
  GeoJSONSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";

import maplibreSdfIcon from "@/assets/images/maplibre-sdf.png";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function SdfIcon() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Images
        images={{
          "example-icon": {
            source: maplibreSdfIcon,
            sdf: true,
          },
        }}
      />
      <GeoJSONSource
        id="sdf-source"
        data={{
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [-20, 0] },
              properties: {
                color: "#95befa",
              },
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [0, 0] },
              properties: {
                color: "#285daa",
              },
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [20, 0] },
              properties: {
                color: "#ffffff",
              },
            },
          ],
        }}
      >
        <SymbolLayer
          id="sl-1"
          style={{
            iconImage: "example-icon",
            iconColor: ["get", "color"],
            iconSize: 0.25,
            iconAllowOverlap: true,
          }}
        />
      </GeoJSONSource>
    </MapView>
  );
}
