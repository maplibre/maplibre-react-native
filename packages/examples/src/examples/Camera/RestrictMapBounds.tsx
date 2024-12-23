import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import bboxPolygon from "@turf/bbox-polygon";

import { EU_BOUNDS } from "../../constants/GEOMETRIES";
import { colors } from "../../styles/colors";
import { sheet } from "../../styles/sheet";

const POLYGON = bboxPolygon([
  EU_BOUNDS.sw[0],
  EU_BOUNDS.sw[1],
  EU_BOUNDS.ne[0],
  EU_BOUNDS.ne[1],
]);

export function RestrictMapBounds() {
  return (
    <MapView style={sheet.matchParent}>
      <Camera maxBounds={EU_BOUNDS} bounds={EU_BOUNDS} />
      <ShapeSource id="bounds-source" shape={POLYGON}>
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
