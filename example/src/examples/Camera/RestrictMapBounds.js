import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import bboxPolygon from '@turf/bbox-polygon';

import sheet from '../../styles/sheet';
import Page from '../common/Page';

const boundsStyle = {
  fillColor: 'rgba(255, 255, 255, 0.1)',
  fillOutlineColor: 'white',
};

const bounds = {
  ne: [-4.265762, 51.054738],
  sw: [-5.760365, 49.947256],
};

const {ne, sw} = bounds;
const polygon = bboxPolygon([sw[0], sw[1], ne[0], ne[1]]);

const RestrictMapBounds = props => (
  <Page {...props}>
    <MapLibreGL.MapView
      style={sheet.matchParent}
      styleURL={MapLibreGL.StyleURL.SatelliteStreet}>
      <MapLibreGL.Camera
        maxBounds={bounds}
        zoomLevel={7}
        centerCoordinate={[-4.744276, 50.361239]}
      />
      <MapLibreGL.ShapeSource id="bounds" shape={polygon}>
        <MapLibreGL.FillLayer id="boundsFill" style={boundsStyle} />
      </MapLibreGL.ShapeSource>
    </MapLibreGL.MapView>
  </Page>
);

export default RestrictMapBounds;
