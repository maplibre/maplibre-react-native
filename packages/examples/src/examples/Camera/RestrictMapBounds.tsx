import MapLibreGL from "@maplibre/maplibre-react-native";
import bboxPolygon from "@turf/bbox-polygon";

import Page from "../../components/Page";
import { EU_BOUNDS } from "../../constants/GEOMETRIES";
import { colors } from "../../styles/colors";
import { sheet } from "../../styles/sheet";

const POLYGON = bboxPolygon([
  EU_BOUNDS.sw[0],
  EU_BOUNDS.sw[1],
  EU_BOUNDS.ne[0],
  EU_BOUNDS.ne[1],
]);

export default function RestrictMapBounds() {
  return (
    <Page>
      <MapLibreGL.MapView style={sheet.matchParent}>
        <MapLibreGL.Camera maxBounds={EU_BOUNDS} bounds={EU_BOUNDS} />
        <MapLibreGL.ShapeSource id="bounds-source" shape={POLYGON}>
          <MapLibreGL.FillLayer
            id="bounds-fill"
            style={{
              fillColor: colors.blue,
              fillOpacity: 0.1,
              fillOutlineColor: colors.blue,
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </Page>
  );
}
