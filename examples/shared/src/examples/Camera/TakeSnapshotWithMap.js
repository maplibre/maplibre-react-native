import { Camera, MapView } from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../styles/colors";
import { sheet } from "../../styles/sheet";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.blue,
    height: 60,
    justifyContent: "center",
  },
  buttonText: { color: "white" },
  imageContainer: { flex: 0.5 },
  map: {
    flex: 0.5,
  },
  mapContainer: { flex: 1 },
});

export class TakeSnapshotWithMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uri: "",
    };
  }

  async onTakeSnapshot() {
    const uri = await this.map.takeSnap(false);
    this.setState({ uri });
  }

  render() {
    return (
      <>
        <View style={styles.mapContainer}>
          <MapView ref={(ref) => (this.map = ref)} style={styles.map}>
            <Camera
              zoomLevel={8}
              pitch={45}
              centerCoordinate={[-122.400021, 37.789085]}
            />
          </MapView>

          <View style={styles.imageContainer}>
            {this.state.uri ? (
              <Image
                resizeMode="contain"
                style={sheet.matchParent}
                source={{ uri: this.state.uri }}
              />
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={() => this.onTakeSnapshot()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Take snapshot</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}
