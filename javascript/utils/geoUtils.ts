import along from "@turf/along";
import distance from "@turf/distance";
import {
  feature,
  featureCollection,
  Id,
  lineString,
  point,
  Properties,
} from "@turf/helpers";

export const makePoint = point;

export const makeLineString = lineString;

export function makeLatLngBounds(
  northEastCoordinates: GeoJSON.Position,
  southWestCoordinates: GeoJSON.Position,
): GeoJSON.FeatureCollection {
  return featureCollection([
    point(northEastCoordinates),
    point(southWestCoordinates),
  ]);
}

export const makeFeature = feature;

export function makeFeatureCollection(
  features: GeoJSON.Feature[] = [],
  options?: { bbox?: GeoJSON.BBox; id?: Id },
): GeoJSON.FeatureCollection {
  return featureCollection(features, options);
}

export function addToFeatureCollection<T extends GeoJSON.Geometry>(
  newFeatureCollection: GeoJSON.FeatureCollection<T, Properties>,
  newFeature: GeoJSON.Feature<T, Properties>,
): GeoJSON.FeatureCollection<T, Properties> {
  return {
    ...newFeatureCollection,
    features: [...newFeatureCollection.features, newFeature],
  };
}

export const calculateDistance = distance;

export const pointAlongLine = along;
