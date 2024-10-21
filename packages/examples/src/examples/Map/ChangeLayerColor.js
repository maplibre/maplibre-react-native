import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Text } from "react-native";

import Bubble from "../common/Bubble";
import Page from "../common/Page";

const defaultCamera = {
  centerCoordinate: [12.338, 45.4385],
  zoomLevel: 4,
};

const styles = {
  mapView: { flex: 1 },
};

class ChangeLayerColor extends React.Component {
  state = {
    backgroundColor: "",
  };

  onPress = () => {
    const backgroundColor = `#${Math.random().toString(16).substr(-6)}`;
    this.setState({ backgroundColor });
  };

  render() {
    const { backgroundColor } = this.state;
    return (
      <Page>
        <MapLibreGL.MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={styles.mapView}
        >
          <MapLibreGL.Camera defaultSettings={defaultCamera} />
          {!!backgroundColor && (
            <MapLibreGL.BackgroundLayer
              id="background"
              style={{ backgroundColor }}
            />
          )}
        </MapLibreGL.MapView>
        <Bubble onPress={this.onPress}>
          <Text>Paint Water</Text>
        </Bubble>
      </Page>
    );
  }
}

export default ChangeLayerColor;
