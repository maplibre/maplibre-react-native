import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Text, StyleSheet } from "react-native";

import MapLibreDemoTilesBlue from "../../assets/styles/maplibre-demo-tiles-blue.json";
import MapLibreDemoTilesWhite from "../../assets/styles/maplibre-demo-tiles-white.json";
import Bubble from "../../components/Bubble";
import Page from "../../components/Page";

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
    this.setState((prevState) => ({
      showAltStyle: !prevState.showAltStyle,
    }));
  };

  render() {
    return (
      <Page>
        <MapLibreGL.MapView
          styleURL={MapLibreGL.StyleURL.Default}
          style={styles.map}
        >
          <MapLibreGL.Camera defaultSettings={defaultCamera} />
          <MapLibreGL.Style
            json={
              this.state.showAltStyle
                ? MapLibreDemoTilesBlue
                : MapLibreDemoTilesWhite
            }
          />
        </MapLibreGL.MapView>
        <Bubble onPress={this.onPress}>
          <Text>{this.state.showAltStyle ? "Style 2" : "Style 1"}</Text>
        </Bubble>
      </Page>
    );
  }
}

export default StyleJson;
