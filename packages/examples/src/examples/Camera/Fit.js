import { Camera, MapView, StyleURL } from "@maplibre/maplibre-react-native";
import { isEqual } from "lodash";
import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  EU_BOUNDS,
  EU_CENTER_COORDINATES,
  US_BOUNDS,
  US_CENTER_COORDINATES,
} from "../../constants/GEOMETRIES";
import { sheet } from "../../styles/sheet";

const buildPadding = ([top, right, bottom, left] = [0, 0, 0, 0]) => {
  return {
    paddingLeft: left,
    paddingRight: right,
    paddingTop: top,
    paddingBottom: bottom,
  };
};

const paddingZero = buildPadding();
const paddingTop = buildPadding([200, 40, 40, 40]);
const paddingBottom = buildPadding([40, 40, 200, 40]);

export class Fit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationType: "usCenter", // usCenter | usBounds | euCenter | euBounds
      zoomLevel: 4, // number
      followUserLocation: false,
      padding: paddingZero,

      // For updating the UI in this example.
      cachedFlyTo: undefined, // us | eu
      cachedZoomLevel: undefined, // number
    };

    this.camera = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const changed = (stateKey) => {
      // Checking if final state is `undefined` prevents another round of zeroing out in
      // second `componentDidUpdate` call.
      return (
        !isEqual(prevState[stateKey], this.state[stateKey]) &&
        this.state[stateKey] !== undefined
      );
    };

    if (changed("followUserLocation") && this.state.followUserLocation) {
      this.setState({
        locationType: undefined,
        zoomLevel: undefined,
        cachedFlyTo: undefined,
        cachedZoomLevel: undefined,
      });
      return;
    }

    if (changed("locationType") || changed("zoomLevel") || changed("padding")) {
      this.setState({
        cachedFlyTo: undefined,
        cachedZoomLevel: undefined,
      });
    } else if (changed("cachedFlyTo") || changed("cachedZoomLevel")) {
      this.setState({
        locationType: undefined,
        zoomLevel: undefined,
        padding: paddingZero,
      });
    }
  }

  renderSection = (title, buttons, fade = false) => {
    return (
      <View style={{ paddingBottom: 5, opacity: fade ? 0.5 : 1 }}>
        <Text>{title}</Text>
        <ScrollView
          horizontal
          style={{
            flex: 0,
            flexDirection: "row",
            width: "100%",
            paddingVertical: 10,
          }}
        >
          {buttons.map((button) => (
            <TouchableOpacity
              key={button.title}
              style={{
                flex: 0,
                padding: 5,
                marginRight: 5,
                backgroundColor: button.selected ? "coral" : "#d8d8d8",
                borderRadius: 5,
              }}
              onPress={button.onPress}
            >
              <Text>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  cameraProps = () => {
    const { locationType, zoomLevel, followUserLocation, padding } = this.state;

    const p = {
      bounds: undefined,
      centerCoordinate: undefined,
      zoomLevel: undefined,
      followUserLocation,
      padding,
      animationDuration: 500,
      animationMode: "easeTo",
    };

    if (locationType === "usCenter") {
      p.centerCoordinate = US_CENTER_COORDINATES;
    } else if (locationType === "usBounds") {
      p.bounds = US_BOUNDS;
    } else if (locationType === "euCenter") {
      p.centerCoordinate = EU_CENTER_COORDINATES;
    } else if (locationType === "euBounds") {
      p.bounds = EU_BOUNDS;
    }

    if (zoomLevel !== undefined) {
      p.zoomLevel = zoomLevel;
    }

    return p;
  };

  render() {
    const {
      locationType,
      zoomLevel,
      followUserLocation,
      padding,
      cachedFlyTo,
      cachedZoomLevel,
    } = this.state;

    const centerIsSet = locationType?.toLowerCase().includes("center");

    const locationTypeButtons = [
      ["US (center)", "usCenter"],
      ["US (bounds)", "usBounds"],
      ["EU (center)", "euCenter"],
      ["EU (bounds)", "euBounds"],
      ["undef", undefined],
    ].map((o) => {
      return {
        title: `${o[0]}`,
        selected: locationType === o[1],
        onPress: () => this.setState({ locationType: o[1] }),
      };
    });

    const zoomConfigButtons = [2, 4, 8, 12, 16, 20, undefined].map((n) => {
      return {
        title: n ? `${n}` : "undef",
        selected: zoomLevel === n,
        onPress: () => this.setState({ zoomLevel: n }),
      };
    });

    const zoomToButtons = [14, 15, 16, 17, 18, 19, 20].map((n) => {
      return {
        title: `${n}`,
        selected: cachedZoomLevel === n,
        onPress: () => {
          this.camera.zoomTo(n, 1000);
          this.setState({ cachedZoomLevel: n });
        },
      };
    });

    return (
      <>
        <MapView styleURL={StyleURL.Default} style={sheet.matchParent}>
          <Camera ref={(ref) => (this.camera = ref)} {...this.cameraProps()} />
          <View style={{ flex: 1, ...padding }}>
            <View style={{ flex: 1, borderColor: "white", borderWidth: 4 }} />
          </View>
        </MapView>

        <ScrollView
          style={{
            flex: 0,
            width: "100%",
            maxHeight: 350,
            backgroundColor: "white",
          }}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 20,
          }}
        >
          {this.renderSection("Region", locationTypeButtons)}

          {this.renderSection(
            "Zoom" +
              (centerIsSet ? "" : " (only used if center coordinate is set)"),
            zoomConfigButtons,
            !centerIsSet,
          )}

          {this.renderSection("Follow user location", [
            {
              title: followUserLocation ? "Enabled" : "Disabled",
              selected: followUserLocation,
              onPress: () =>
                this.setState({ followUserLocation: !followUserLocation }),
            },
          ])}

          {this.renderSection("Fly to (imperative)", [
            {
              title: "US",
              selected: cachedFlyTo === "us",
              onPress: () => {
                this.camera.flyTo(US_CENTER_COORDINATES);
                this.setState({ cachedFlyTo: "us" });
              },
            },
            {
              title: "EU",
              selected: cachedFlyTo === "eu",
              onPress: () => {
                this.camera.flyTo(EU_CENTER_COORDINATES);
                this.setState({ cachedFlyTo: "eu" });
              },
            },
          ])}

          {this.renderSection("Zoom to (imperative)", zoomToButtons)}

          {this.renderSection("Padding", [
            {
              title: "None",
              selected: isEqual(padding, paddingZero),
              onPress: () => this.setState({ padding: paddingZero }),
            },
            {
              title: "Top",
              selected: isEqual(padding, paddingTop),
              onPress: () => this.setState({ padding: paddingTop }),
            },
            {
              title: "Bottom",
              selected: isEqual(padding, paddingBottom),
              onPress: () => this.setState({ padding: paddingBottom }),
            },
          ])}
        </ScrollView>
      </>
    );
  }
}
