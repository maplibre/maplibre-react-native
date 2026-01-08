import {
  MapView,
  type MapViewRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button, type LayoutRectangle, StyleSheet, View } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

export function Project() {
  const mapRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<PixelPoint>();
  const [layout, setLayout] = useState<LayoutRectangle>();

  return (
    <View
      style={styles.flex1}
      onLayout={(event) => setLayout(event.nativeEvent.layout)}
    >
      <MapView ref={mapRef} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapRef.current?.project([0, 0]));
          }}
        />

        <AssertZod
          schema={z.tuple([
            z
              .number()
              .min((layout?.width ?? 0) / 2 - 1)
              .max((layout?.width ?? 0) / 2 + 1),
            z
              .number()
              .min((layout?.height ?? 0) / 2 - 1)
              .max((layout?.height ?? 0) / 2 + 1),
          ])}
          actual={result}
        />
      </Bubble>
    </View>
  );
}
