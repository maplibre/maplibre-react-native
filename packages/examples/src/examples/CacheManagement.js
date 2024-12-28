import { MapView, OfflineManager } from "@maplibre/maplibre-react-native";
import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sheet } from "../styles/sheet";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 3,
    justifyContent: "center",
    padding: 8,
    width: "100%",
  },
  buttonTxt: {
    color: "white",
    textAlign: "center",
  },
  control: {
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 8,
    width: "40%",
  },
  controlsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textInput: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 8,
    padding: 8,
    width: "100%",
  },
});

export class CacheManagement extends Component {
  state = {
    cacheSize: "",
  };

  invalidateAmbientCache = async () => {
    await OfflineManager.invalidateAmbientCache();
    Alert.alert("Ambient cache successfully invalidated");
  };

  resetDatabase = async () => {
    await OfflineManager.resetDatabase();
    Alert.alert("Database successfully reset");
  };

  clearAmbientCache = async () => {
    await OfflineManager.clearAmbientCache();
    Alert.alert("Ambient cache successfully cleared");
  };

  setMaximumAmbientCacheSize = async () => {
    const newMaxSize = parseInt(this.state.cacheSize, 10);
    await OfflineManager.setMaximumAmbientCacheSize(newMaxSize);
    Alert.alert(`Max cache size successfully set to ${newMaxSize} bytes`);
  };

  validateCacheInputValue = (value) => !isNaN(parseInt(value, 10));

  onChangeCacheSize = (cacheSize) => this.setState({ cacheSize });

  render() {
    const validSizeValue = this.validateCacheInputValue(this.state.cacheSize);
    const buttonStyles = validSizeValue
      ? styles.button
      : [styles.button, { backgroundColor: "grey" }];

    return (
      <>
        <MapView style={sheet.matchParent} />

        <View style={styles.controls}>
          <View style={styles.controlsContainer}>
            <View style={styles.control}>
              <TouchableOpacity
                onPress={this.invalidateAmbientCache}
                style={styles.button}
              >
                <Text style={styles.buttonTxt}>Invalidate cache</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.control}>
              <TouchableOpacity
                onPress={this.resetDatabase}
                style={styles.button}
              >
                <Text style={styles.buttonTxt}>Reset database</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.control}>
              <TextInput
                onChangeText={this.onChangeCacheSize}
                value={this.state.cacheSize}
                placeholder="New max"
                keyboardType="numeric"
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={this.setMaximumAmbientCacheSize}
                style={buttonStyles}
                disabled={!validSizeValue}
              >
                <Text style={styles.buttonTxt}>Set ambient max cache</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.control}>
              <TouchableOpacity
                onPress={this.clearAmbientCache}
                style={styles.button}
              >
                <Text style={styles.buttonTxt}>Clear ambient cache</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}
