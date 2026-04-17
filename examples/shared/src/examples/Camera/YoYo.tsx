import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function YoYo() {
  const [zoomLevel, setZoomLevel] = useState(2);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const cameraLoop = () => {
      requestAnimationFrame(() => {
        setZoomLevel((prevState) => (prevState === 4 ? 0 : 4));
        timeout = setTimeout(() => cameraLoop(), 2000);
      });
    };
    cameraLoop();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Map mapStyle={MAPLIBRE_DEMO_STYLE}>
      <Camera duration={2000} easing="ease" zoom={zoomLevel} />
    </Map>
  );
}
