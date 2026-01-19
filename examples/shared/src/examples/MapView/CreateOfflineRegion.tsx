import geoViewport from "@mapbox/geo-viewport";
import {
  Camera,
  type LngLat,
  MapView,
  OfflineManager,
  OfflinePack,
  type OfflinePackCreateOptions,
  type OfflinePackError,
  type OfflinePackStatus,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Bubble } from "@/components/Bubble";
import { AMERICANA_VECTOR_STYLE } from "@/constants/AMERICANA_VECTOR_STYLE";

const CENTER: LngLat = [18.6466, 54.352];
const MVT_SIZE = 512;
const PACK_NAME = "test";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 3,
    flex: 0.4,
    justifyContent: "center",
    padding: 8,
  },
  buttonCnt: {
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonTxt: {
    color: "white",
  },
});

export function CreateOfflineRegion() {
  const [offlineRegionStatus, setOfflineRegionStatus] =
    useState<OfflinePackStatus | null>(null);
  const [offlinePack, setOfflinePack] = useState<OfflinePack | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return () => {
      OfflineManager.unsubscribe(PACK_NAME);
    };
  }, []);

  function onDownloadProgress(pack: OfflinePack, status: OfflinePackStatus) {
    setOfflinePack(pack);
    setOfflineRegionStatus(status);
  }

  function onDownloadError(pack: OfflinePack, err: OfflinePackError) {
    console.log("onDownloadError", pack, err);
  }

  function createPack() {
    const { width, height } = Dimensions.get("window");
    const viewportBounds = geoViewport.bounds(
      CENTER,
      12,
      [width, height],
      MVT_SIZE,
    );

    // LngLatBounds format: [west, south, east, north]
    const bounds: [number, number, number, number] = [
      viewportBounds[0], // west
      viewportBounds[1], // south
      viewportBounds[2], // east
      viewportBounds[3], // north
    ];

    const options: OfflinePackCreateOptions = {
      metadata: {
        name: PACK_NAME,
      },
      // TODO: demotiles are crashing the app when used with offline manager
      mapStyle: AMERICANA_VECTOR_STYLE,
      bounds,
      minZoom: 12,
      maxZoom: 14,
    };

    // start download
    OfflineManager.createPack(options, onDownloadProgress, onDownloadError);
  }

  async function onDidFinishLoadingStyle() {
    try {
      const pack = await OfflineManager.getPack(PACK_NAME);

      if (!pack) {
        return;
      }

      const status = await pack.status();

      setOfflinePack(pack);
      setOfflineRegionStatus(status);
    } finally {
      setIsLoading(false);
    }
  }

  function onDownload() {
    createPack();
  }

  function onResume() {
    if (offlinePack) {
      offlinePack.resume();
    }
  }

  function onPause() {
    if (offlinePack) {
      offlinePack.pause();
    }
  }

  async function onDelete() {
    if (!offlinePack) {
      return;
    }

    await OfflineManager.deletePack(PACK_NAME);

    setOfflinePack(null);
    setOfflineRegionStatus(null);
  }

  async function onStatusRequest() {
    if (!offlinePack) {
      return;
    }

    const status = await offlinePack.status();

    if (status) {
      Alert.alert("Get Status", JSON.stringify(status, null, 2));
    } else {
      Alert.alert("Get Status", "Could not get status");
    }
  }

  return (
    <>
      <MapView
        onDidFinishLoadingMap={onDidFinishLoadingStyle}
        mapStyle={AMERICANA_VECTOR_STYLE}
      >
        <Camera
          initialViewState={{
            center: CENTER,
            zoom: 11,
          }}
        />
      </MapView>

      {!isLoading && (
        <Bubble>
          {offlineRegionStatus === null && (
            <TouchableOpacity onPress={onDownload}>
              <View style={styles.button}>
                <Text style={styles.buttonTxt}>Download</Text>
              </View>
            </TouchableOpacity>
          )}

          {offlineRegionStatus !== null && (
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
                  (offlineRegionStatus.completedResourceSize * 100) /
                    1024 /
                    1024,
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

              <View style={styles.buttonCnt}>
                <TouchableOpacity onPress={onResume}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Resume</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={onStatusRequest}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Status</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPause}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Pause</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete}>
                  <View style={[styles.button, { backgroundColor: "red" }]}>
                    <Text style={styles.buttonTxt}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Bubble>
      )}
    </>
  );
}
