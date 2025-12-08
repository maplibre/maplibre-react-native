import {
  MapView,
  type MapViewRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "../../../components/AssertZod";
import { Bubble } from "../../../components/Bubble";

export function Project() {
  const mapRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<PixelPoint>();

  return (
    <>
      <MapView ref={mapRef} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapRef.current?.project([0, 0]));
          }}
        />

        <AssertZod
          schema={z.tuple([
            z.number().min(180).max(500),
            z.number().min(180).max(500),
          ])}
          actual={result}
        />
      </Bubble>
    </>
  );
}
