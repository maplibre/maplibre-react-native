import {
  Camera,
  MapView,
  type MapViewRef,
  OfflineManager,
  OfflinePack,
  type OfflinePackCreateOptions,
  type OfflinePackStatus,
} from "@maplibre/maplibre-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import { Bubble } from "@/components/Bubble";
import { AMERICANA_VECTOR_STYLE } from "@/constants/AMERICANA_VECTOR_STYLE";

export function CreateOfflinePack() {
  const mapViewRef = useRef<MapViewRef>(null);

  const [offlineRegionStatus, setOfflineRegionStatus] =
    useState<OfflinePackStatus>();
  const [offlinePack, setOfflinePack] = useState<OfflinePack>();

  useEffect(() => {
    return () => {
      if (offlinePack) OfflineManager.removeListener(offlinePack.id);
    };
  }, []);

  return (
    <>
      <MapView ref={mapViewRef} mapStyle={AMERICANA_VECTOR_STYLE}>
        <Camera
          initialViewState={{
            center: [13.404954, 52.520008],
            zoom: 11,
          }}
        />
      </MapView>

      <Bubble>
        {!offlineRegionStatus && (
          <Button
            onPress={async () => {
              const bounds = await mapViewRef.current?.getBounds();

              if (!bounds) {
                return;
              }

              const options: OfflinePackCreateOptions = {
                // TODO: demotiles are crashing the app when used with offline manager
                mapStyle: AMERICANA_VECTOR_STYLE,
                bounds,
                minZoom: 12,
                maxZoom: 14,
                metadata: {
                  name: "Example",
                },
              };

              const newOfflinePack = await OfflineManager.createPack(
                options,
                (pack, status) => {
                  setOfflinePack(pack);
                  setOfflineRegionStatus(status);
                },
                (pack, error) => {
                  console.error("onDownloadError", pack, error);
                },
              );
              setOfflinePack(newOfflinePack);
            }}
            title="Download"
          />
        )}

        {offlineRegionStatus && (
          <>
            <Text>Download State: {offlineRegionStatus.state}</Text>
            <Text>Download Percent: {offlineRegionStatus.percentage} %</Text>
            <Text>
              Completed Resource Count:{" "}
              {offlineRegionStatus.completedResourceCount}
            </Text>
            <Text>
              Completed Resource Size:{" "}
              {Math.round(
                (offlineRegionStatus.completedResourceSize * 100) / 1024 / 1024,
              ) / 100}{" "}
              MB
            </Text>
            <Text>
              Completed Tile Count: {offlineRegionStatus.completedTileCount}
            </Text>
            <Text>
              Required Resource Count:{" "}
              {offlineRegionStatus.requiredResourceCount}
            </Text>

            <View>
              <Button
                onPress={() => {
                  if (offlinePack) {
                    offlinePack.resume();
                  }
                }}
                title="Resume"
              />

              <Button
                onPress={async () => {
                  if (!offlinePack) {
                    return;
                  }

                  const status = await offlinePack.status();

                  if (status) {
                    Alert.alert("Get Status", JSON.stringify(status, null, 2));
                  } else {
                    Alert.alert("Get Status", "Could not get status");
                  }
                }}
                title="Status"
              />

              <Button
                onPress={() => {
                  if (offlinePack) {
                    offlinePack.pause();
                  }
                }}
                title="Pause"
              />

              <Button
                onPress={async () => {
                  if (!offlinePack) {
                    return;
                  }

                  await OfflineManager.deletePack(offlinePack.id);

                  setOfflinePack(undefined);
                  setOfflineRegionStatus(undefined);
                }}
                title="Delete"
              />
            </View>
          </>
        )}
      </Bubble>
    </>
  );
}
