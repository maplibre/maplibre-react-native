import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Text } from "react-native";

import Bubble from "../common/Bubble";
import Page from "../common/Page";

const defaultCamera = {
  centerCoordinate: [-74.005974, 40.712776],
  zoomLevel: 13,
};

const styles = {
  mapView: { flex: 1 },
};

class SourceLayerVisibility extends React.Component {
  state = {
    show: true,
  };

  onPress = () => {
    this.setState(
      (prevState) => ({
        show: !prevState.show,
      }),
      () => {
        this._map.setSourceVisibility(this.state.show, "composite", "road");
      },
    );
  };

  render() {
    return (
      <Page>
        <MapLibreGL.MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={styles.mapView}
        >
          <MapLibreGL.Camera defaultSettings={defaultCamera} />
        </MapLibreGL.MapView>
        <Bubble onPress={this.onPress}>
          <Text>{`${
            this.state.show ? "Hide" : "Show"
          } 'Roads' source layer`}</Text>
        </Bubble>
      </Page>
    );
  }
}

export default SourceLayerVisibility;
