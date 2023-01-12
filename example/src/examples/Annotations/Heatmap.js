import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import {SF_OFFICE_COORDINATE} from '../../utils';
import Page from '../common/Page';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';

class Heatmap extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  render() {
    return (
      <Page {...this.props}>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera
            zoomLevel={10}
            centerCoordinate={SF_OFFICE_COORDINATE}
          />

          <MapLibreGL.ShapeSource
            id="earthquakes"
            url="https://www.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson">
            <MapLibreGL.HeatmapLayer
              id="earthquakes"
              sourceID="earthquakes"
              style={{
                heatmapColor: [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  1,
                  'rgb(178,24,43)',
                ],
              }}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>
      </Page>
    );
  }
}

export default Heatmap;
