import { Camera, Map, type MapRef } from "@maplibre/maplibre-react-native";
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

export function CreateStaticMapFromMap() {
  const [uri, setUri] = useState("");
  const mapRef = useRef<MapRef>(null);

  const onTakeSnapshot = async () => {
    if (mapRef.current) {
      const resultUri = await mapRef.current.createStaticMapImage({
        output: "file",
      });

      setUri(resultUri);
    }
  };

  return (
    <>
      <View style={styles.flex1}>
        <Map ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE} style={styles.map}>
          <Camera zoom={8} pitch={45} center={[-122.400021, 37.789085]} />
        </Map>

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
