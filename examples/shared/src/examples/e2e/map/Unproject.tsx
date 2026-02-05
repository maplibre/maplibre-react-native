import {
  Map,
  type MapRef,
  type PixelPoint,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function Unproject() {
  const mapRef = useRef<MapRef>(null);
  const [result, setResult] = useState<PixelPoint>();

  return (
    <>
      <Map ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapRef.current?.unproject([0, 0]));
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
