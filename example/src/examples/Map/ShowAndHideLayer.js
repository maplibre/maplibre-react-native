import React from 'react';
import {Text} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import Page from '../common/Page';
import Bubble from '../common/Bubble';

const defaultCamera = {
  centerCoordinate: [-77.036532, 38.897318],
  zoomLevel: 16,
};

const styles = {
  mapView: {flex: 1},
};

class ShowAndHideLayer extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  state = {
    show: true,
  };

  onPress = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  render() {
    const visibility = this.state.show ? 'visible' : 'none';
    return (
      <Page {...this.props}>
        <MapLibreGL.MapView
          ref={c => (this._map = c)}
          onPress={this.onPress}
          style={styles.mapView}>
          <MapLibreGL.Camera defaultSettings={defaultCamera} />
          <MapLibreGL.FillLayer id="building" style={{visibility}} />
          <MapLibreGL.LineLayer id="building-outline" style={{visibility}} />
        </MapLibreGL.MapView>
        <Bubble onPress={this.onPress}>
          <Text>{this.state.show ? 'Hide Buildings' : 'Show Buildings'}</Text>
        </Bubble>
      </Page>
    );
  }
}

export default ShowAndHideLayer;
