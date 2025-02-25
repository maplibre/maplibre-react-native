import {
  CircleLayer,
  MapView,
  VectorSource,
} from "@maplibre/maplibre-react-native";

export function PMTilesVectorSource() {
  return (
    <MapView style={{ flex: 1 }}>
      <VectorSource
        id="foursquare-10M"
        url="pmtiles://https://oliverwipfli.ch/data/foursquare-os-places-10M-2024-11-20.pmtiles"
        attribution='Foursquare <a href="https://github.com/wipfli/foursquare-os-places-pmtiles/">(Download)</a>'
      >
        <CircleLayer
          id="foursquare-10M"
          sourceLayerID="place"
          style={{ circleColor: "red" }}
        />
      </VectorSource>
    </MapView>
  );
}
