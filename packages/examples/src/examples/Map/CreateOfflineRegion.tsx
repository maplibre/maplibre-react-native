import geoViewport from "@mapbox/geo-viewport";
import MapLibreGL, {
  OfflinePack,
  OfflineProgressStatus,
  OfflinePackError,
} from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

import sheet from "../../styles/sheet";
import Bubble from "../common/Bubble";
import Page from "../common/Page";
import { AMERICANA_STYLE } from "../mapStyles";

const CENTER_COORD: [number, number] = [-73.970895, 40.723279];
const MVT_SIZE = 512;
const PACK_NAME = `test-${Date.now()}`;

const styles = StyleSheet.create({
  bubble: { flex: 1 },
  button: {
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 3,
    flex: 0.4,
    justifyContent: "center",
    padding: 8,
  },
  buttonCnt: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonTxt: {
    color: "white",
  },
});

type OfflinePackDownloadState =
  (typeof MapLibreGL.OfflinePackDownloadState)[keyof typeof MapLibreGL.OfflinePackDownloadState];

function getRegionDownloadState(downloadState: OfflinePackDownloadState) {
  switch (downloadState) {
    case MapLibreGL.OfflinePackDownloadState.Active:
      return "Active";
    case MapLibreGL.OfflinePackDownloadState.Complete:
      return "Complete";
    default:
      return "Inactive";
  }
}

export default function CreateOfflineRegion() {
  const [offlineRegionStatus, setOfflineRegionStatus] =
    useState<OfflineProgressStatus | null>(null);
  const [offlinePack, setOfflinePack] = useState<OfflinePack | null>(null);

  useEffect(() => {
    return () => {
      MapLibreGL.offlineManager.unsubscribe(PACK_NAME);
      MapLibreGL.offlineManager.deletePack(PACK_NAME);
    };
  }, []);

  function onDownloadProgress(
    pack: OfflinePack,
    status: OfflineProgressStatus,
  ) {
    setOfflinePack(pack);
    setOfflineRegionStatus(status);
  }

  function onDownloadError(pack: OfflinePack, err: OfflinePackError) {
    console.log("onDownloadError", pack, err);
  }

  async function onDidFinishLoadingStyle() {
    const { width, height } = Dimensions.get("window");
    const viewportBounds = geoViewport.bounds(
      CENTER_COORD,
      12,
      [width, height],
      MVT_SIZE,
    );

    const bounds: [GeoJSON.Position, GeoJSON.Position] = [
      [viewportBounds[0], viewportBounds[1]],
      [viewportBounds[2], viewportBounds[3]],
    ];

    const options = {
      name: PACK_NAME,
      styleURL: AMERICANA_STYLE,
      bounds,
      minZoom: 10,
      maxZoom: 20,
    };

    // start download
    MapLibreGL.offlineManager.createPack(
      options,
      onDownloadProgress,
      onDownloadError,
    );
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

  async function onStatusRequest() {
    if (offlinePack) {
      const status = await offlinePack.status();
      Alert.alert("Get Status", JSON.stringify(status, null, 2));
    }
  }

  return (
    <Page>
      <MapLibreGL.MapView
        onDidFinishLoadingMap={onDidFinishLoadingStyle}
        style={sheet.matchParent}
        styleURL={AMERICANA_STYLE}
      >
        <MapLibreGL.Camera zoomLevel={10} centerCoordinate={CENTER_COORD} />
      </MapLibreGL.MapView>

      {offlineRegionStatus !== null && (
        <Bubble>
          <View style={styles.bubble}>
            <Text>
              Download State:{" "}
              {getRegionDownloadState(offlineRegionStatus.state)}
            </Text>
            <Text>Download Percent: {offlineRegionStatus.percentage}</Text>
            <Text>
              Completed Resource Count:{" "}
              {offlineRegionStatus.completedResourceCount}
            </Text>
            <Text>
              Completed Resource Size:{" "}
              {offlineRegionStatus.completedResourceSize}
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
            </View>
          </View>
        </Bubble>
      )}
    </Page>
  );
}
