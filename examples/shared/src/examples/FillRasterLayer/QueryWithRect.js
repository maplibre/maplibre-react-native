import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
  StyleURL,
} from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Text } from "react-native";

import newYorkCityDistrictsFeatureCollection from "../../assets/geojson/new-york-city-districts.json";
import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

const styles = {
  neighborhoods: {
    fillAntialias: true,
    fillColor: "blue",
    fillOutlineColor: "black",
    fillOpacity: 0.84,
  },
  selectedNeighborhoods: {
    fillAntialias: true,
    fillColor: "green",
    fillOpacity: 0.84,
  },
  bubbleText: { textAlign: "center" },
};

export class QueryWithRect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenCoords: [],
      selectedGeoJSON: null,
    };

    this.onPress = this.onPress.bind(this);
  }

  async onPress(e) {
    const { screenPointX, screenPointY } = e.properties;

    const screenCoords = Object.assign([], this.state.screenCoords);
    screenCoords.push([screenPointX, screenPointY]);

    if (screenCoords.length === 2) {
      const featureCollection = await this._map.queryRenderedFeaturesInRect(
        this.getBoundingBox(screenCoords),
        null,
        ["nycFill"],
      );

      this.setState({
        screenCoords: [],
        selectedGeoJSON: featureCollection.features.length
          ? featureCollection
          : null,
      });
    } else {
      this.setState({ screenCoords });
    }
  }

  getBoundingBox(screenCoords) {
    const maxX = Math.max(screenCoords[0][0], screenCoords[1][0]);
    const minX = Math.min(screenCoords[0][0], screenCoords[1][0]);
    const maxY = Math.max(screenCoords[0][1], screenCoords[1][1]);
    const minY = Math.min(screenCoords[0][1], screenCoords[1][1]);
    return [maxY, maxX, minY, minX];
  }

  get message() {
    if (this.state.screenCoords.length === 1) {
      return "Press in one more location to close the rect";
    }
    return "Press in two different locations to form a rect to query with";
  }

  render() {
    return (
      <>
        <MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={sheet.matchParent}
          styleURL={StyleURL.Default}
        >
          <Camera zoomLevel={9} centerCoordinate={[-73.970895, 40.723279]} />

          <ShapeSource id="nyc" shape={newYorkCityDistrictsFeatureCollection}>
            <FillLayer id="nycFill" style={styles.neighborhoods} />
          </ShapeSource>

          {this.state.selectedGeoJSON ? (
            <ShapeSource id="selectedNYC" shape={this.state.selectedGeoJSON}>
              <FillLayer
                id="selectedNYCFill"
                style={styles.selectedNeighborhood}
              />
            </ShapeSource>
          ) : null}
        </MapView>

        <Bubble>
          <Text style={styles.bubbleText}>{this.message}</Text>
        </Bubble>
      </>
    );
  }
}
