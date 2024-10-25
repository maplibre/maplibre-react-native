import { featureCollection, point } from "@turf/helpers";

export function makeNativeBounds(ne: GeoJSON.Position, sw: GeoJSON.Position) {
  return JSON.stringify(featureCollection([point(ne), point(sw)]));
}
