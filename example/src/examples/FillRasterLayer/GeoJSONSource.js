import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import gridPattern from '../../assets/grid_pattern.png';
import smileyFaceGeoJSON from '../../assets/smiley_face.json';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import Page from '../common/Page';

const layerStyles = {
  background: {
    backgroundPattern: gridPattern,
  },
  smileyFace: {
    fillAntialias: true,
    fillColor: 'white',
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
  },
};

class GeoJSONSource extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  render() {
    return (
      <Page {...this.props}>
        <MapLibreGL.MapView
          ref={ref => (this.map = ref)}
          style={sheet.matchParent}
          styleURL={MapLibreGL.StyleURL.Dark}>
          <MapLibreGL.Camera
            zoomLevel={2}
            centerCoordinate={[-35.15165038, 40.6235728]}
          />

          <MapLibreGL.VectorSource>
            <MapLibreGL.BackgroundLayer
              id="background"
              style={layerStyles.background}
            />
          </MapLibreGL.VectorSource>

          <MapLibreGL.ShapeSource
            id="smileyFaceSource"
            shape={smileyFaceGeoJSON}>
            <MapLibreGL.FillLayer
              id="smileyFaceFill"
              style={layerStyles.smileyFace}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>
      </Page>
    );
  }
}

export default GeoJSONSource;
