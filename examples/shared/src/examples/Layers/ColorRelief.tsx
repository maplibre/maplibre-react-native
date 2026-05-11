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

export function ColorRelief() {
  return (
    <Map mapStyle={mapStyle}>
      <RasterDEMSource url="https://tiles.mapterhorn.com/tilejson.json">
        <Layer
          type="color-relief"
          paint={{
            "color-relief-color": [
              "interpolate",
              ["linear"],
              ["elevation"],
              0,
              "rgb(50, 120, 200)",
              100,
              "rgb(20, 160, 155)",
              300,
              "rgb(50, 180, 80)",
              700,
              "rgb(120, 200, 60)",
              1200,
              "rgb(200, 215, 55)",
              1800,
              "rgb(235, 175, 40)",
              2500,
              "rgb(215, 100, 30)",
              3500,
              "rgb(185, 40, 20)",
              5000,
              "rgb(140, 55, 100)",
              6500,
              "rgb(165, 145, 165)",
              8849,
              "rgb(240, 235, 230)",
            ],
          }}
        />
      </RasterDEMSource>
    </Map>
  );
}
