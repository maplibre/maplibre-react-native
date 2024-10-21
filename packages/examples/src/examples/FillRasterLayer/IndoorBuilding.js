import MapLibreGL from "@maplibre/maplibre-react-native";
import { Slider } from "@rneui/themed";
import React from "react";
import { View, StyleSheet } from "react-native";

import indoorMapGeoJSON from "../../assets/indoor_3d_map.json";
import colors from "../../styles/colors";
import sheet from "../../styles/sheet";
import Page from "../common/Page";

const styles = StyleSheet.create({
  slider: {
    alignItems: "stretch",
    flex: 1,
    justifyContent: "center",
    maxHeight: 60,
    paddingHorizontal: 24,
  },
});

const layerStyles = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
    // fillExtrusionColorTransition: {duration: 2000, delay: 0},
  },
};

class IndoorBuilding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: -80,
    };

    this.onSliderChange = this.onSliderChange.bind(this);
  }

  onSliderChange(value) {
    this.setState({ sliderValue: value });
  }

  render() {
    return (
      <Page>
        <MapLibreGL.MapView
          ref={(ref) => (this.map = ref)}
          style={sheet.matchParent}
        >
          <MapLibreGL.Camera
            zoomLevel={16}
            pitch={40}
            heading={20}
            centerCoordinate={[-87.61694, 41.86625]}
          />

          <MapLibreGL.Light
            style={{ position: [5, 90, this.state.sliderValue] }}
          />

          <MapLibreGL.ShapeSource
            id="indoorBuildingSource"
            shape={indoorMapGeoJSON}
          >
            <MapLibreGL.FillExtrusionLayer
              id="building3d"
              style={layerStyles.building}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>

        <View style={styles.slider}>
          <Slider
            value={this.state.sliderValue}
            onValueChange={this.onSliderChange}
            thumbTintColor={colors.primary.blue}
            minimumValue={-180}
            maximumValue={180}
            thumbTouchSize={{ width: 44, height: 44 }}
            maximumTrackTintColor={colors.secondary.purpleLight}
            minimumTrackTintColor={colors.secondary.purpleDark}
          />
        </View>
      </Page>
    );
  }
}

export default IndoorBuilding;
