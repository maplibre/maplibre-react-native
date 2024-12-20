import {
  MapView,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { feature, featureCollection } from "@turf/helpers";
import React, { Component } from "react";
import { Text } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";
import { Bubble } from "../../components/Bubble";
import { sheet } from "../../styles/sheet";

const styles = {
  icon: {
    iconImage: maplibreIcon,
    iconAllowOverlap: true,
  },
};

export class CustomIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      featureCollection: featureCollection([]),
    };

    this.onPress = this.onPress.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
  }

  async onPress(e) {
    const aFeature = feature(e.geometry);
    aFeature.id = `${Date.now()}`;

    this.setState((prevState) => ({
      featureCollection: featureCollection([
        ...prevState.featureCollection.features,
        aFeature,
      ]),
    }));
  }

  onSourceLayerPress({ features, coordinates, point }) {
    console.log(
      "You pressed a layer here are your features:",
      features,
      coordinates,
      point,
    );
  }

  render() {
    return (
      <>
        <MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={sheet.matchParent}
        >
          <ShapeSource
            id="symbolLocationSource"
            hitbox={{ width: 20, height: 20 }}
            onPress={this.onSourceLayerPress}
            shape={this.state.featureCollection}
          >
            <SymbolLayer id="symbolLocationSymbols" style={styles.icon} />
          </ShapeSource>
        </MapView>

        <Bubble>
          <Text>Tap to add an icon</Text>
        </Bubble>
      </>
    );
  }
}
