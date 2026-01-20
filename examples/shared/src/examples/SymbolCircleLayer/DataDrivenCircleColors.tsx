import {
  Camera,
  CircleLayer,
  MapView,
  VectorSource,
} from "@maplibre/maplibre-react-native";

const styles: { circles: any } = {
  circles: {
    circleRadius: [
      "interpolate",
      ["exponential", 1.75],
      ["zoom"],
      12,
      2,
      22,
      180,
    ],

    circleColor: [
      "match",
      ["get", "ethnicity"],
      "White",
      "#fbb03b",
      "Black",
      "#223b53",
      "Hispanic",
      "#e55e5e",
      "Asian",
      "#3bb2d0",
      /* other */ "#ccc",
    ],
  },
};

export function DataDrivenCircleColors() {
  return (
    <MapView>
      <Camera zoom={10} pitch={45} center={[-122.400021, 37.789085]} />

      <VectorSource id="population" url="mapbox://examples.8fgz4egr">
        <CircleLayer
          id="sf2010CircleFill"
          source-layer="sf2010"
          style={styles.circles}
        />
      </VectorSource>
    </MapView>
  );
}
