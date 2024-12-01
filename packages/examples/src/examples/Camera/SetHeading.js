import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";

import TabBarView from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

class SetHeading extends React.Component {
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
    MapLibreGL.locationManager.start();
  }

  componentDidUpdate() {
    if (this.state.followUserLocation) {
      this.setState({ followUserLocation: false });
    }
  }

  componentWillUnmount() {
    MapLibreGL.locationManager.stop();
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
        <MapLibreGL.MapView
          ref={(ref) => (this.map = ref)}
          style={sheet.matchParent}
        >
          <MapLibreGL.Camera {...this.state} />
          <MapLibreGL.UserLocation />
        </MapLibreGL.MapView>
      </TabBarView>
    );
  }
}

export default SetHeading;
