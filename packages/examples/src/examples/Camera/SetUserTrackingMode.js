import MapLibreGL from "@maplibre/maplibre-react-native";
import React from "react";
import { Text } from "react-native";

import sheet from "../../styles/sheet";
import { onSortOptions } from "../../utils";
import Bubble from "../common/Bubble";
import TabBarPage from "../common/TabBarPage";

const styles = {
  bubbleOne: { bottom: 80 },
  bubbleTwo: { bottom: 150 },
  bubbleThree: { bottom: 220 },
};

class SetUserTrackingMode extends React.Component {
  constructor(props) {
    super(props);

    this._trackingOptions = Object.keys(MapLibreGL.UserTrackingMode)
      .map((key) => {
        return {
          label: key,
          data: MapLibreGL.UserTrackingMode[key],
        };
      })
      .concat([
        {
          label: "None",
          data: "none",
        },
      ])
      .sort(onSortOptions);

    this.state = {
      showUserLocation: true,
      userSelectedUserTrackingMode: this._trackingOptions[3].data,
      currentTrackingMode: this._trackingOptions[3].data,
      showsUserHeadingIndicator: false,
    };

    this.onTrackingChange = this.onTrackingChange.bind(this);
    this.onUserTrackingModeChange = this.onUserTrackingModeChange.bind(this);
    this.onToggleUserLocation = this.onToggleUserLocation.bind(this);
    this.onToggleHeadingIndicator = this.onToggleHeadingIndicator.bind(this);
  }

  onTrackingChange(index, userTrackingMode) {
    this.setState({
      userSelectedUserTrackingMode: userTrackingMode,
      currentTrackingMode: userTrackingMode,
    });
  }

  onUserTrackingModeChange(e) {
    const { followUserMode } = e.nativeEvent.payload;
    this.setState({ currentTrackingMode: followUserMode || "none" });
  }

  onToggleUserLocation() {
    this.setState((prevState) => ({
      showUserLocation: !prevState.showUserLocation,
    }));
  }

  onToggleHeadingIndicator() {
    this.setState((prevState) => ({
      showsUserHeadingIndicator: !prevState.showsUserHeadingIndicator,
    }));
  }

  get userTrackingModeText() {
    switch (this.state.currentTrackingMode) {
      case MapLibreGL.UserTrackingMode.Follow:
        return "Follow";
      case MapLibreGL.UserTrackingMode.FollowWithCourse:
        return "FollowWithCourse";
      case MapLibreGL.UserTrackingMode.FollowWithHeading:
        return "FollowWithHeading";
      default:
        return "None";
    }
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        scrollable
        defaultValue={3}
        options={this._trackingOptions}
        onOptionPress={this.onTrackingChange}
      >
        <MapLibreGL.MapView style={sheet.matchParent}>
          <MapLibreGL.UserLocation
            visible={this.state.showUserLocation}
            showsUserHeadingIndicator={this.state.showsUserHeadingIndicator}
          />

          <MapLibreGL.Camera
            defaultSettings={{
              centerCoordinate: [-111.8678, 40.2866],
              zoomLevel: 0,
            }}
            followUserLocation={
              this.state.userSelectedUserTrackingMode !== "none"
            }
            followUserMode={
              this.state.userSelectedUserTrackingMode !== "none"
                ? this.state.userSelectedUserTrackingMode
                : "normal"
            }
            onUserTrackingModeChange={this.onUserTrackingModeChange}
          />
        </MapLibreGL.MapView>

        <Bubble style={styles.bubbleOne}>
          <Text>User Tracking Mode: {this.userTrackingModeText}</Text>
        </Bubble>

        <Bubble onPress={this.onToggleUserLocation} style={styles.bubbleTwo}>
          <Text>
            Toggle User Location:{" "}
            {this.state.showUserLocation ? "true" : "false"}
          </Text>
        </Bubble>

        <Bubble
          onPress={this.onToggleHeadingIndicator}
          style={styles.bubbleThree}
        >
          <Text>
            Toggle user heading indicator:{" "}
            {this.state.showsUserHeadingIndicator ? "true" : "false"}
          </Text>
        </Bubble>
      </TabBarPage>
    );
  }
}

export default SetUserTrackingMode;
