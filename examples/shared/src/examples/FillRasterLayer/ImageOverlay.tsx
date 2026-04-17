import {
  Camera,
  ImageSource,
  type LngLat,
  Map,
  Layer,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import radar0 from "@/assets/images/radar0.png";
import radar1 from "@/assets/images/radar1.png";
import radar2 from "@/assets/images/radar2.png";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

const FRAMES = [radar0, radar1, radar2] as const;

const COORDINATES: [LngLat, LngLat, LngLat, LngLat] = [
  [-80.425, 46.437], // top left
  [-71.516, 46.437], // top right
  [-71.516, 37.936], // bottom right
  [-80.425, 37.936], // bottom left
];

export function ImageOverlay() {
  const [index, setIndex] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const loop = () => {
      requestAnimationFrame(() => {
        setIndex((prevState) => ((prevState + 1) % 3) as 0 | 1 | 2);

        timeout = setTimeout(() => loop(), 1000);
      });
    };
    loop();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera center={[-75, 41]} zoom={4} />

      <ImageSource
        id="image-source"
        url={FRAMES[index]}
        coordinates={COORDINATES}
      >
        <Layer
          type="raster"
          id="raster-layer"
          paint={{ "raster-opacity": 0.6 }}
        />
      </ImageSource>
    </Map>
  );
}
