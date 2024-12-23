import { MapView } from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Text } from "react-native";

import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

export class ShowClick extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: undefined,
      longitude: undefined,
      screenPointX: undefined,
      screenPointY: undefined,
    };

    this.onPress = this.onPress.bind(this);
  }

  get hasValidLastClick() {
    return (
      typeof this.state.latitude === "number" &&
      typeof this.state.longitude === "number"
    );
  }

  onPress(event) {
    const { geometry, properties } = event;

    this.setState({
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
      screenPointX: properties.screenPointX,
      screenPointY: properties.screenPointY,
    });
  }

  renderLastClicked() {
    if (!this.hasValidLastClick) {
      return (
        <Bubble>
          <Text>Click the map!</Text>
        </Bubble>
      );
    }

    return (
      <Bubble>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Screen Point X: {this.state.screenPointX}</Text>
        <Text>Screen Point Y: {this.state.screenPointY}</Text>
      </Bubble>
    );
  }

  render() {
    return (
      <>
        <MapView style={sheet.matchParent} onPress={this.onPress} />
        {this.renderLastClicked()}
      </>
    );
  }
}
