import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

import { sheet } from "../../styles/sheet";

export function YoYo() {
  const [zoomLevel, setZoomLevel] = useState(2);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

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
    <MapView style={sheet.matchParent}>
      <Camera
        animationDuration={2000}
        animationMode="easeTo"
        zoomLevel={zoomLevel}
      />
    </MapView>
  );
}
