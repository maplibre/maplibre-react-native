import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import smileyFaceGeoJSON from '../../assets/smiley_face.json';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import Page from '../common/Page';

const layerStyles = {
  smileyFaceLight: {
    fillAntialias: true,
    fillColor: 'white',
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
  },
  smileyFaceDark: {
    fillAntialias: true,
    fillColor: 'black',
    fillOutlineColor: 'rgba(0, 0, 0, 0.84)',
  },
};

class TwoByTwo extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  renderMap(styleURL, layerStyle) {
    return (
      <MapLibreGL.MapView
        zoomLevel={2}
        centerCoordinate={[-35.15165038, 40.6235728]}
        onSetCameraComplete={this.onUpdateZoomLevel}
        ref={ref => (this.map = ref)}
        style={sheet.matchParent}
        styleURL={styleURL}>
        <MapLibreGL.ShapeSource id="smileyFaceSource" shape={smileyFaceGeoJSON}>
          <MapLibreGL.FillLayer id="smileyFaceFill" style={layerStyle} />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    );
  }

  render() {
    return (
      <Page {...this.props}>
        {this.renderMap(MapLibreGL.StyleURL.Light, layerStyles.smileyFaceDark)}
        {this.renderMap(MapLibreGL.StyleURL.Dark, layerStyles.smileyFaceLight)}
      </Page>
    );
  }
}

export default TwoByTwo;
