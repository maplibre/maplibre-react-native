import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";

import sheet from "../../styles/sheet";
import TabBarPage from "../common/TabBarPage";

const DISPLACEMENT = [5, 10, 15];
const OPTIONS = [{ label: "5 fps" }, { label: "10 fps" }, { label: "15 fps" }];

class SetAndroidPreferredFramesPerSecond extends React.Component {
  state = { androidPreferredFramesPerSecond: DISPLACEMENT[0] };

  componentDidMount() {
    MapLibreGL.locationManager.start();
  }

  componentWillUnmount() {
    MapLibreGL.locationManager.stop();
  }

  onFramesPerSecondChange = (index: number) => {
    this.setState({ androidPreferredFramesPerSecond: DISPLACEMENT[index] });
  };

  render() {
    return (
      <TabBarPage
        {...this.props}
        options={OPTIONS}
        onOptionPress={this.onFramesPerSecondChange}
      >
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.Camera followZoomLevel={16} followUserLocation />

          <MapLibreGL.UserLocation
            animated
            renderMode="native"
            androidPreferredFramesPerSecond={
              this.state.androidPreferredFramesPerSecond
            }
          />
        </MapLibreGL.MapView>
      </TabBarPage>
    );
  }
}

export default SetAndroidPreferredFramesPerSecond;
