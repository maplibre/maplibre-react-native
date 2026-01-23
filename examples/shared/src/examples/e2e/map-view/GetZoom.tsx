import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { z } from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";
import { MAPLIBRE_DEMO_STYLE } from "@/constants/MAPLIBRE_DEMO_STYLE";

export function GetZoom() {
  const mapRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<number>();

  return (
    <>
      <MapView ref={mapRef} mapStyle={MAPLIBRE_DEMO_STYLE} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapRef.current?.getZoom());
          }}
        />

        <AssertZod schema={z.number().min(0).max(1)} actual={result} />
      </Bubble>
    </>
  );
}
