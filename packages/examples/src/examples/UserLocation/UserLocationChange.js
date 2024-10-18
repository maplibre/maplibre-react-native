import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Text } from "react-native";

import sheet from "../../styles/sheet";
import Bubble from "../common/Bubble";
import Page from "../common/Page";

class UserLocationChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      latitude: 0.0,
      longitude: 0.0,
      altitude: 0.0,
      heading: 0.0,
      accuracy: 0.0,
      speed: 0.0,
    };

    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
  }

  onUserLocationUpdate(location) {
    this.setState({
      timestamp: location.timestamp,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude,
      heading: location.coords.heading,
      accuracy: location.coords.accuracy,
      speed: location.coords.speed,
    });
  }

  renderLocationInfo() {
    if (this.state.timestamp <= 0) {
      return null;
    }
    return (
      <Bubble>
        <Text>Timestamp: {this.state.timestamp}</Text>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Altitude: {this.state.altitude}</Text>
        <Text>Heading: {this.state.heading}</Text>
        <Text>Accuracy: {this.state.accuracy}</Text>
        <Text>Speed: {this.state.speed}</Text>
      </Bubble>
    );
  }

  render() {
    return (
      <Page>
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.UserLocation
            visible
            onUpdate={this.onUserLocationUpdate}
          />
          <MapLibreGL.Camera
            zoomLevel={16}
            followUserMode="normal"
            followUserLocation
          />
        </MapLibreGL.MapView>
        {this.renderLocationInfo()}
      </Page>
    );
  }
}

export default UserLocationChange;
