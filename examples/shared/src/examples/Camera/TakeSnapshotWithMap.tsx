import {
  Camera,
  MapView,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";
import { colors } from "@/styles/colors";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
});

export function TakeSnapshotWithMap() {
  const [uri, setUri] = useState("");
  const mapViewRef = useRef<MapViewRef>(null);

  const onTakeSnapshot = async () => {
    if (mapViewRef.current) {
      const resultUri = await mapViewRef.current.takeSnap(false);

      setUri(resultUri);
    }
  };

  return (
    <>
      <View style={styles.flex1}>
        <MapView
          ref={mapViewRef}
          mapStyle={MAPLIBRE_DEMO_STYLE}
          style={styles.map}
        >
          <Camera zoom={8} pitch={45} center={[-122.400021, 37.789085]} />
        </MapView>

        <View style={styles.imageContainer}>
          {uri ? (
            <Image resizeMode="contain" style={styles.flex1} source={{ uri }} />
          ) : null}
        </View>
      </View>

      <TouchableOpacity onPress={onTakeSnapshot}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Take snapshot</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
