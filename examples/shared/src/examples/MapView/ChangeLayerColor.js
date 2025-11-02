import {
  BackgroundLayer,
  Camera,
  MapView,
} from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";

const defaultCamera = {
  centerCoordinate: [12.338, 45.4385],
  zoomLevel: 4,
};

const styles = {
  mapView: { flex: 1 },
};

export class ChangeLayerColor extends Component {
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
      <>
        <MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={styles.mapView}
        >
          <Camera defaultSettings={defaultCamera} />
          {!!backgroundColor && (
            <BackgroundLayer id="background" style={{ backgroundColor }} />
          )}
        </MapView>
        <Bubble onPress={this.onPress}>
          <Text>Paint Water</Text>
        </Bubble>
      </>
    );
  }
}
