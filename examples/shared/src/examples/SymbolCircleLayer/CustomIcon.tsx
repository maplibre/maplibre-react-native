import {
  MapView,
  type MapViewRef,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";
import { Bubble } from "../../components/Bubble";

const styles = {
  icon: {
    iconImage: maplibreIcon,
    iconAllowOverlap: true,
  },
};

export function CustomIcon() {
  const mapViewRef = useRef<MapViewRef>(null);
  const [geometries, setGeometries] = useState<GeoJSON.Point[]>([]);

  return (
    <>
      <MapView
        ref={mapViewRef}
        onPress={async (event) => {
          const point: GeoJSON.Point = {
            type: "Point",
            coordinates: [
              event.nativeEvent.longitude,
              event.nativeEvent.latitude,
            ],
          };

          setGeometries((prev) => [...prev, point]);
        }}
      >
        <ShapeSource
          id="symbolLocationSource"
          hitbox={{ width: 20, height: 20 }}
          onPress={(event) => {
            console.log(
              "You pressed a layer here are your features:",
              event.nativeEvent.features,
              {
                longitude: event.nativeEvent.longitude,
                latitude: event.nativeEvent.latitude,
              },
              {
                locationX: event.nativeEvent.locationX,
                locationY: event.nativeEvent.locationY,
              },
            );
          }}
          shape={{ type: "GeometryCollection", geometries }}
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
