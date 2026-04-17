import { Layer, Map, VectorSource } from "@maplibre/maplibre-react-native";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function PMTilesVectorSource() {
  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <VectorSource
        id="foursquare-10M"
        url="pmtiles://https://oliverwipfli.ch/data/foursquare-os-places-10M-2024-11-20.pmtiles"
        attribution='Foursquare <a href="https://github.com/wipfli/foursquare-os-places-pmtiles/">(Download)</a>'
      >
        <Layer
          type="circle"
          id="foursquare-10M"
          source-layer="place"
          paint={{ "circle-color": "red" }}
        />
      </VectorSource>
    </Map>
  );
}
