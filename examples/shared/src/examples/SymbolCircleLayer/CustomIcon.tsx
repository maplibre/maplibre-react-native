import {
  MapView,
  type MapViewRef,
  GeoJSONSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";

import { Bubble } from "@/components/Bubble";

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
            coordinates: event.nativeEvent.lngLat,
          };

          setGeometries((prev) => [...prev, point]);
        }}
      >
        <GeoJSONSource
          id="symbolLocationSource"
          hitbox={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={(event) => {
            console.log(
              "Layer pressed, queried features:",
              event.nativeEvent.features,
              event.nativeEvent.lngLat,
              event.nativeEvent.point,
            );
          }}
          data={{ type: "GeometryCollection", geometries }}
        >
          <SymbolLayer id="symbolLocationSymbols" style={styles.icon} />
        </GeoJSONSource>
      </MapView>

      <Bubble>
        <Text>Tap to add an icon</Text>
      </Bubble>
    </>
  );
}
