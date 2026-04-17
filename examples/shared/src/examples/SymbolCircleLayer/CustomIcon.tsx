import {
  Map,
  type MapRef,
  GeoJSONSource,
  Layer,
  Images,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";

import maplibreIcon from "../../assets/images/maplibre.png";

import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const MAPLIBRE_ICON = "maplibre-icon";

export function CustomIcon() {
  const mapRef = useRef<MapRef>(null);
  const [geometries, setGeometries] = useState<GeoJSON.Point[]>([]);

  return (
    <>
      <Map
        ref={mapRef}
        mapStyle={MAPLIBRE_DEMO_STYLE}
        onPress={async (event) => {
          const point: GeoJSON.Point = {
            type: "Point",
            coordinates: event.nativeEvent.lngLat,
          };

          setGeometries((prev) => [...prev, point]);
        }}
      >
        <Images images={{ [MAPLIBRE_ICON]: maplibreIcon }} />

        <GeoJSONSource
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
          <Layer
            type="symbol"
            layout={{
              "icon-image": MAPLIBRE_ICON,
              "icon-allow-overlap": true,
            }}
          />
        </GeoJSONSource>
      </Map>

      <Bubble>
        <Text>Tap to add an icon</Text>
      </Bubble>
    </>
  );
}
