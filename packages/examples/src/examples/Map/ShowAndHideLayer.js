import { Camera, FillLayer, MapView } from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";

const defaultCamera = {
  centerCoordinate: [-77.036532, 38.897318],
  zoomLevel: 2,
};

const styles = {
  mapView: { flex: 1 },
};

export class ShowAndHideLayer extends Component {
  state = {
    show: true,
  };

  onPress = () => {
    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  };

  render() {
    const visibility = this.state.show ? "visible" : "none";
    return (
      <>
        <MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={styles.mapView}
        >
          <Camera defaultSettings={defaultCamera} />
          <FillLayer id="countries-label" style={{ visibility }} />
        </MapView>
        <Bubble onPress={this.onPress}>
          <Text>
            {this.state.show ? "Hide Country Labels" : "Show Country Labels"}
          </Text>
        </Bubble>
      </>
    );
  }
}
