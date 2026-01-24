import { MapView, OfflineManager } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

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

export function CacheManagement() {
  const [cacheSize, setCacheSize] = useState("");

  const validSizeValue = !isNaN(parseInt(cacheSize, 10));
  const buttonStyles = validSizeValue
    ? styles.button
    : [styles.button, { backgroundColor: "grey" }];

  return (
    <>
      <MapView mapStyle={MAPLIBRE_DEMO_STYLE} />

      <View style={styles.controlsContainer}>
        <View style={styles.control}>
          <TouchableOpacity
            onPress={async () => {
              try {
                await OfflineManager.invalidateAmbientCache();
                Alert.alert("Ambient cache successfully invalidated");
              } catch (error) {
                Alert.alert(
                  "Failed to invalidate ambient cache",
                  String(error),
                );
              }
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Invalidate cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.control}>
          <TouchableOpacity
            onPress={async () => {
              try {
                await OfflineManager.resetDatabase();
                Alert.alert("Database successfully reset");
              } catch (error) {
                Alert.alert("Failed to reset database", String(error));
              }
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Reset database</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.control}>
          <TextInput
            onChangeText={(value) => {
              setCacheSize(value);
            }}
            value={cacheSize}
            placeholder="New max"
            keyboardType="numeric"
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={async () => {
              const newMaxSize = parseInt(cacheSize, 10);

              try {
                await OfflineManager.setMaximumAmbientCacheSize(newMaxSize);
                Alert.alert(
                  `Max cache size successfully set to ${newMaxSize} bytes`,
                );
              } catch (error) {
                Alert.alert("Failed to set max cache size", String(error));
              }
            }}
            style={buttonStyles}
            disabled={!validSizeValue}
          >
            <Text style={styles.buttonTxt}>Set ambient max cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.control}>
          <TouchableOpacity
            onPress={async () => {
              try {
                await OfflineManager.clearAmbientCache();
                Alert.alert("Ambient cache successfully cleared");
              } catch (error) {
                Alert.alert("Failed to clear ambient cache", String(error));
              }
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Clear ambient cache</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
