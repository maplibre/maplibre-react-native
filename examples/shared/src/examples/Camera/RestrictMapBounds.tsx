import {
  Camera,
  FillLayer,
  MapView,
  GeoJSONSource,
} from "@maplibre/maplibre-react-native";
import bboxPolygon from "@turf/bbox-polygon";

import { EU_BOUNDS } from "@/constants/GEOMETRIES";
import { colors } from "@/styles/colors";

const POLYGON = bboxPolygon(EU_BOUNDS);

export function RestrictMapBounds() {
  return (
    <MapView>
      <Camera maxBounds={EU_BOUNDS} bounds={EU_BOUNDS} />
      <GeoJSONSource id="bounds-source" data={POLYGON}>
        <FillLayer
          id="bounds-fill"
          style={{
            fillColor: colors.blue,
            fillOpacity: 0.1,
            fillOutlineColor: colors.blue,
          }}
        />
      </GeoJSONSource>
    </MapView>
  );
}
