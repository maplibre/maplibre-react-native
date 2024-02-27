import {
  featureCollection,
  point,
  feature,
  lineString,
  Id,
  Properties,
} from '@turf/helpers';
import distance from '@turf/distance';
import along from '@turf/along';
import geoViewport from '@mapbox/geo-viewport';

const VECTOR_TILE_SIZE = 512;

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
  options?: {bbox?: GeoJSON.BBox; id?: Id},
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

export function getOrCalculateVisibleRegion(
  coord: [number, number] | {lon: number; lat: number},
  zoomLevel: number,
  width: number,
  height: number,
  nativeRegion: {properties: {visibleBounds: [number, number][]}},
): {ne: [number, number]; sw: [number, number]} {
  const region = {
    ne: [0, 0] as [number, number],
    sw: [0, 0] as [number, number],
  };

  if (!nativeRegion || !Array.isArray(nativeRegion.properties.visibleBounds)) {
    const bounds = geoViewport.bounds(
      coord,
      zoomLevel,
      [width, height],
      VECTOR_TILE_SIZE,
    );
    region.ne = [bounds[3], bounds[2]];
    region.sw = [bounds[1], bounds[0]];
  } else {
    region.ne = nativeRegion.properties.visibleBounds[0];
    region.sw = nativeRegion.properties.visibleBounds[1];
  }

  return region;
}
