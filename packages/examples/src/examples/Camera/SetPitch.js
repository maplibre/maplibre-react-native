import {
  Camera,
  locationManager,
  MapView,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import React from "react";

import TabBarView from "../../components/TabBarView";
import { sheet } from "../../styles/sheet";

class SetPitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followPitch: 15,
      zoomLevel: 16,
      duration: 300,
    };

    this._pitchOptions = [
      { label: "15", data: 15 },
      { label: "45", data: 45 },
      { label: "60", data: 60 },
    ];

    this.onUpdatePitch = this.onUpdatePitch.bind(this);
  }

  componentDidMount() {
    locationManager.start();
  }

  componentWillUnmount() {
    locationManager.stop();
  }

  onUpdatePitch(index, pitch) {
    this.setState({ followPitch: pitch });
  }

  render() {
    return (
      <TabBarView
        {...this.props}
        options={this._pitchOptions}
        onOptionPress={this.onUpdatePitch}
      >
        <MapView style={sheet.matchParent}>
          <Camera {...this.state} followUserLocation />
          <UserLocation />
        </MapView>
      </TabBarView>
    );
  }
}

export default SetPitch;
