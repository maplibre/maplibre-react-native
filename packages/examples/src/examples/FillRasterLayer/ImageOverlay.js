import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import Page from '../common/Page';
import nyc from '../../assets/nyc.png'

const styles = {
  rasterLayer: { rasterOpacity: 1 },
};

const coordQuads = [
  [
    [-80.425, 46.437], // top left
    [-71.516, 46.437], // top right
    [-71.516, 37.936], // bottom right
    [-80.425, 37.936], // bottom left
  ],
  [
    [-85.425, 45.437], // top left
    [-75.516, 45.437], // top right
    [-75.516, 36.936], // bottom right
    [-85.425, 36.936], // bottom left
  ],
];

// const bounds = [
//   [74.50, 41.10], // top left
//   [73.45, 41.10], // top right
//   [73.45, 40.30], // bottom right
//   [74.50, 40.30], // bottom left
// ]

// eslint-disable-next-line @typescript-eslint/no-var-requires
const style = JSON.stringify(require("../../assets/empty-json-file.json"));

class ImageOverlay extends React.Component {
  render() {
    return (
      <Page>
        <MapLibreGL.MapView
          ref={ref => (this.map = ref)}
          style={sheet.matchParent}
          styleURL={style}>
          <MapLibreGL.Camera zoomLevel={4} centerCoordinate={[-80, 46]} />

          <MapLibreGL.ImageSource
            url={nyc}
            coordinates={coordQuads[0]}
            key="d"
            id="radarSource">
            <MapLibreGL.RasterLayer
              id="radarLayer"
              style={styles.rasterLayer}
            />
          </MapLibreGL.ImageSource>
        </MapLibreGL.MapView>
      </Page>
    );
  }
}

export default ImageOverlay;
