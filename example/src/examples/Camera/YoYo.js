import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

import sheet from '../../styles/sheet';
import {SF_OFFICE_COORDINATE} from '../../utils';
import Page from '../common/Page';
import BaseExamplePropTypes from '../common/BaseExamplePropTypes';

class YoYo extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  timeout = null;

  constructor(props) {
    super(props);

    this.state = {
      zoomLevel: 2,
    };
  }

  componentDidMount() {
    this.cameraLoop();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  cameraLoop() {
    requestAnimationFrame(async () => {
      const nextZoomLevel = this.state.zoomLevel === 6 ? 2 : 6;
      this.setState({zoomLevel: nextZoomLevel});
      this.timeout = setTimeout(() => this.cameraLoop(), 2000);
    });
  }

  render() {
    return (
      <Page {...this.props}>
        <MapLibreGL.MapView
          ref={ref => (this.map = ref)}
          style={sheet.matchParent}
          styleURL={MapLibreGL.StyleURL.Dark}>
          <MapLibreGL.Camera
            zoomLevel={this.state.zoomLevel}
            centerCoordinate={SF_OFFICE_COORDINATE}
          />
        </MapLibreGL.MapView>
      </Page>
    );
  }
}

export default YoYo;
