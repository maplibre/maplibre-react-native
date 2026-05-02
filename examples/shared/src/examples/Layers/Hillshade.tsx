import {
  Layer,
  Map,
  RasterDEMSource,
  type StyleSpecification,
} from "@maplibre/maplibre-react-native";

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "white",
      },
    },
  ],
};

export function Hillshade() {
  return (
    <Map mapStyle={mapStyle}>
      <RasterDEMSource url="https://tiles.mapterhorn.com/tilejson.json">
        <Layer type="hillshade" />
      </RasterDEMSource>
    </Map>
  );
}
