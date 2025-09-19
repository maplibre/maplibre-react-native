import { Camera, MapView } from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { TabBarView } from "../../components/TabBarView";
import { EU_BOUNDS, EU_CENTER_COORDINATES } from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

const styles = {
  bubble: { marginBottom: 100 },
};

const isValidCoordinate = (geometry) => {
  if (!geometry) {
    return false;
  }
  return geometry.coordinates[0] !== 0 && geometry.coordinates[1] !== 0;
};

export class ShowRegionDidChange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: "",
      cameraConfig: undefined,
      regionFeature: undefined,
    };

    this._tabOptions = [
      { label: "Fly To", data: EU_CENTER_COORDINATES },
      {
        label: "Fit Bounds",
        data: EU_BOUNDS,
      },
      { label: "Zoom To", data: 4 },
    ];

    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.onRegionWillChange = this.onRegionWillChange.bind(this);
    this.onRegionIsChanging = this.onRegionIsChanging.bind(this);
    this.onOptionPress = this.onOptionPress.bind(this);
  }

  async onOptionPress(optionIndex, optionData) {
    if (optionIndex === 0) {
      this.setState({
        cameraConfig: {
          triggerKey: Date.now(),
          centerCoordinate: optionData,
          animationMode: "flyTo",
          animationDuration: 2000,
        },
      });
    } else if (optionIndex === 1) {
      this.setState({
        cameraConfig: {
          triggerKey: Date.now(),
          bounds: optionData,
        },
      });
    } else if (optionIndex === 2) {
      this.setState({
        cameraConfig: {
          triggerKey: Date.now(),
          zoomLevel: optionData,
        },
      });
    }
  }

  onRegionWillChange(regionFeature) {
    this.setState({ reason: "Will Change", regionFeature });
  }

  onRegionDidChange(regionFeature) {
    this.setState({ reason: "Did Change", regionFeature });
  }

  onRegionIsChanging(regionFeature) {
    this.setState({ reason: "Is Changing", regionFeature });
  }

  renderRegionChange() {
    if (
      !this.state.regionFeature ||
      !isValidCoordinate(this.state.regionFeature.geometry)
    ) {
      return (
        <Bubble style={styles.bubble}>
          <Text>Move the map!</Text>
        </Bubble>
      );
    }

    const { geometry, properties } = this.state.regionFeature;

    const neCoord = properties.visibleBounds[0]
      .map((n) => n.toPrecision(6))
      .join(", ");
    const swCoord = properties.visibleBounds[1]
      .map((n) => n.toPrecision(6))
      .join(", ");

    return (
      <Bubble style={styles.bubble}>
        <Text>{this.state.reason}</Text>
        <Text>Latitude: {geometry.coordinates[1]}</Text>
        <Text>Longitude: {geometry.coordinates[0]}</Text>
        <Text>Visible Bounds NE: {neCoord}</Text>
        <Text>Visible Bounds SW: {swCoord}</Text>
        <Text>Zoom Level: {properties.zoomLevel}</Text>
        <Text>Heading: {properties.heading}</Text>
        <Text>Pitch: {properties.pitch}</Text>
        <Text>
          Is User Interaction: {properties.isUserInteraction ? "true" : "false"}
        </Text>
        <Text>Animated: {properties.animated ? "true" : "false"}</Text>
      </Bubble>
    );
  }

  render() {
    return (
      <TabBarView
        {...this.props}
        options={this._tabOptions}
        onOptionPress={this.onOptionPress}
      >
        <MapView
          ref={(c) => (this.map = c)}
          style={sheet.matchParent}
          onRegionWillChange={this.onRegionWillChange}
          onRegionIsChanging={this.onRegionIsChanging}
          onRegionDidChange={this.onRegionDidChange}
        >
          <Camera {...this.state.cameraConfig} />
        </MapView>
        {this.renderRegionChange()}
      </TabBarView>
    );
  }
}
