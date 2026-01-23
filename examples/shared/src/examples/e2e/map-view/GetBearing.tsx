import { MapView, type MapViewRef } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Button } from "react-native";

import { AssertEquals } from "@/components/AssertEquals";
import { Bubble } from "@/components/Bubble";

export function GetBearing() {
  const mapViewRef = useRef<MapViewRef>(null);
  const [result, setResult] = useState<number>();

  return (
    <>
      <MapView ref={mapViewRef} testID="map-view" />
      <Bubble>
        <Button
          title="Act"
          onPress={async () => {
            setResult(await mapViewRef.current?.getBearing());
          }}
        />

        <AssertEquals expect={0} actual={result} />
      </Bubble>
    </>
  );
}
