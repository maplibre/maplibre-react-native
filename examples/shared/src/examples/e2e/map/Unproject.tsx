import { Map, type MapRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

export function Unproject() {
  const mapRef = useRef<MapRef>(null);
  const [result, setResult] = useState<number[]>([]);

  return (
    <View style={styles.flex1}>
      <Map
        ref={mapRef}
        testID="map"
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          event.persist();

          const unprojectedLngLat = await mapRef.current?.unproject(
            event.nativeEvent.point,
          );

          if (unprojectedLngLat) {
            // Use deltas for slight tolerance
            setResult((prev) => [
              ...prev,
              event.nativeEvent.lngLat[0] - unprojectedLngLat[0],
              event.nativeEvent.lngLat[1] - unprojectedLngLat[1],
            ]);
          }
        }}
      />
      <Bubble>
        <AssertZod
          schema={z.array(z.number().min(-0.000000001).max(0.000000001)).min(6)}
          actual={result}
        />
      </Bubble>
    </View>
  );
}
