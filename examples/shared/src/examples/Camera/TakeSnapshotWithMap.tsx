import {
  Camera,
  MapView,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
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
      <View style={sheet.matchParent}>
        <MapView ref={mapViewRef} style={styles.map}>
          <Camera
            zoom={8}
            pitch={45}
            longitude={-122.400021}
            latitude={37.789085}
          />
        </MapView>

        <View style={styles.imageContainer}>
          {uri ? (
            <Image
              resizeMode="contain"
              style={sheet.matchParent}
              source={{ uri }}
            />
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
