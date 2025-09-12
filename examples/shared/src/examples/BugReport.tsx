import {
  Camera,
  type CameraRef,
  MapView,
  type MapViewRef,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";

export function BugReport() {
  const mapViewRef = useRef<MapViewRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const [value, setValue] = useState(false);

  return (
    <>
      <Button
        title={value ? "Disable" : "Enable"}
        onPress={async () => {
          // setValue((prev) => !prev);
          cameraRef.current?.flyTo({ center: { longitude: 0, latitude: 0 } });
        }}
      />
      <MapView ref={mapViewRef} style={{ flex: 1 }}>
        <Camera
          ref={cameraRef}
          // initialViewState={{
          //   longitude: 80,
          //   latitude: 80,
          //   zoom: 4,
          //   padding: {
          //     top: 0,
          //     right: 0,
          //     bottom: 800,
          //     left: 0,
          //   },
          // }}
          // minZoom={value ? undefined : 5}
          // longitude={50}
          // latitude={10}
          // padding={
          //   value
          //     ? { top: 400, right: 0, bottom: 0, left: 0 }
          //     : { top: 0, right: 0, bottom: 0, left: 0 }
          // }
          // zoom={5}
          // easing="fly"
          // duration={2000}
          // bounds={[1, 1, 1, 1]}
          // maxBounds={[-20, 30, 40, 70]}
        />
      </MapView>
    </>
  );
}
