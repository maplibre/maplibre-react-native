import {
  MapView,
  type MapViewRef,
  type ViewState,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";
import * as z from "zod";

import { AssertZod } from "@/components/AssertZod";
import { Bubble } from "@/components/Bubble";

export function GetViewState() {
  const mapRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<ViewState>();

  return (
    <>
      <MapView ref={mapRef} />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapRef.current?.getViewState());
          }}
        />

        <AssertZod
          schema={z.object({
            center: z.tuple([z.number(), z.number()]),
            zoom: z.number(),
            bearing: z.number().refine((value) => value === (0 as number)),
            pitch: z.number().refine((value) => value === (0 as number)),
            bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
          })}
          actual={result}
        />
      </Bubble>
    </>
  );
}
