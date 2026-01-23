import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import bboxPolygon from "@turf/bbox-polygon";

import { EU_BOUNDS } from "@/constants/GEOMETRIES";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const POLYGON = bboxPolygon(EU_BOUNDS);

export function RestrictMapBounds() {
  return (
    <MapView mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera maxBounds={EU_BOUNDS} bounds={EU_BOUNDS} />
      <ShapeSource id="bounds-source" data={POLYGON}>
        <FillLayer
          id="bounds-fill"
          style={{
            fillColor: colors.blue,
            fillOpacity: 0.1,
            fillOutlineColor: colors.blue,
          }}
        />
      </ShapeSource>
    </MapView>
  );
}
