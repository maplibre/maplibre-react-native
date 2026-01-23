import {
  MapView,
  type MapViewRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Unproject() {
  const mapViewRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<PixelPoint>();

  return (
    <>
      <MapView ref={mapViewRef} mapStyle={MAPLIBRE_DEMO_STYLE} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapViewRef.current?.unproject([0, 0]));
          }}
        />

        <AssertZod
          schema={z.tuple([
            z.number().min(-180).max(180),
            z.number().min(-90).max(90),
          ])}
          actual={result}
        />
      </Bubble>
    </>
  );
}
