import MapLibreGL from "@maplibre/maplibre-react-native";
import { default as Home } from "@maplibre-react-native/examples/src/scenes/Examples";
import colors from "@maplibre-react-native/examples/src/styles/colors";
import sheet from "@maplibre-react-native/examples/src/styles/sheet";
import { IS_ANDROID } from "@maplibre-react-native/examples/src/utils";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

LogBox.ignoreLogs([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
]);

const styles = StyleSheet.create({
  noPermissionsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

MapLibreGL.setAccessToken(null);

export default function App() {
  const [isFetchingAndroidPermission, setIsFetchingAndroidPermission] =
    useState(IS_ANDROID);
  const [isAndroidPermissionGranted, setIsAndroidPermissionGranted] =
    useState(false);

  useEffect(() => {
    (async () => {
      if (IS_ANDROID) {
        const isGranted = await MapLibreGL.requestAndroidLocationPermissions();

        setIsAndroidPermissionGranted(isGranted);
        setIsFetchingAndroidPermission(false);
      }
    })();
  }, []);

  if (IS_ANDROID && !isAndroidPermissionGranted) {
    if (isFetchingAndroidPermission) {
      return null;
    }

    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[sheet.matchParent, { backgroundColor: colors.primary.blue }]}
        >
          <View style={sheet.matchParent}>
            <Text style={styles.noPermissionsText}>
              You need to accept location permissions in order to use this
              example applications
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}
