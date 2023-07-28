import React from 'react';
import {Text, StyleSheet} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import StyleJsonExample from '../../assets/style-json-example.json';
import StyleJsonExample2 from '../../assets/style-json-example2.json';
import Page from '../common/Page';
import Bubble from '../common/Bubble';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

const defaultCamera = {
  centerCoordinate: [-78.54382, 40.446947],
  zoomLevel: 3,
  minZoomLevel: 3,
};

class StyleJson extends React.Component {
  state = {
    showAltStyle: false,
  };

  onPress = () => {
    this.setState({
      showAltStyle: !this.state.showAltStyle,
    });
  };

  render() {
    return (
      <Page>
        <MapLibreGL.MapView
          styleURL={MapLibreGL.StyleURL.Light}
          style={styles.map}>
          <MapLibreGL.Camera defaultSettings={defaultCamera} />
          <MapLibreGL.Style
            json={
              this.state.showAltStyle ? StyleJsonExample2 : StyleJsonExample
            }
          />
        </MapLibreGL.MapView>
        <Bubble onPress={this.onPress}>
          <Text>{this.state.showAltStyle ? 'Style 2' : 'Style 1'}</Text>
        </Bubble>
      </Page>
    );
  }
}

export default StyleJson;
