import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Alert } from "react-native";

import TabBarPage from "../../components/TabBarPage";
import {
  EU_CENTER_COORDINATES,
  US_CENTER_COORDINATES,
} from "../../constants/GEOMETRIES";
import sheet from "../../styles/sheet";

class FlyTo extends React.Component {
  static ZERO_ZERO = [0, 0];
  static ZERO_TEN = [0, 10];
  static TEN_ZERO = [10, 0];

  constructor(props) {
    super(props);

    this.state = {
      location: EU_CENTER_COORDINATES,
    };

    this._flyToOptions = [
      { label: "EU", data: EU_CENTER_COORDINATES },
      { label: "US", data: US_CENTER_COORDINATES },
      { label: "0,0", data: FlyTo.ZERO_ZERO },
      { label: "0,10", data: FlyTo.ZERO_TEN },
      { label: "10,0", data: FlyTo.TEN_ZERO },
    ];

    this.onFlyToPress = this.onFlyToPress.bind(this);
    this.onFlyToComplete = this.onFlyToComplete.bind(this);
  }

  onFlyToPress(i) {
    this.setState({ location: this._flyToOptions[i].data });
  }

  onFlyToComplete() {
    Alert.alert("Fly To Animation Completed", "We did it!!!");
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        options={this._flyToOptions}
        onOptionPress={this.onFlyToPress}
      >
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera
            zoomLevel={6}
            animationMode="flyTo"
            animationDuration={6000}
            centerCoordinate={this.state.location}
          />

          <MapLibreGL.UserLocation />
        </MapLibreGL.MapView>
      </TabBarPage>
    );
  }
}

export default FlyTo;
