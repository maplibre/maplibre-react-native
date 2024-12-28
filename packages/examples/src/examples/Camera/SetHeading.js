import {
  Camera,
  LocationManager,
  MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import React, { Component } from "react";

import { TabBarView } from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

export class SetHeading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: 0,
      zoomLevel: 16,
      animationDuration: 150,
      followUserLocation: true,
    };

    this._bearingOptions = [
      { label: "0", data: 0 },
      { label: "90", data: 90 },
      { label: "180", data: 180 },
    ];

    this.onHeadingChange = this.onHeadingChange.bind(this);
  }

  componentDidMount() {
    LocationManager.start();
  }

  componentDidUpdate() {
    if (this.state.followUserLocation) {
      this.setState({ followUserLocation: false });
    }
  }

  componentWillUnmount() {
    LocationManager.stop();
  }

  onHeadingChange(index, heading) {
    this.setState({ heading });
  }

  render() {
    return (
      <TabBarView
        {...this.props}
        options={this._bearingOptions}
        onOptionPress={this.onHeadingChange}
      >
        <MapView ref={(ref) => (this.map = ref)} style={sheet.matchParent}>
          <Camera {...this.state} />
          <UserLocation />
        </MapView>
      </TabBarView>
    );
  }
}
