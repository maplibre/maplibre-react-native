import MapLibreGL from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  LogBox,
  NativeModules,
  Platform,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import { default as Home } from "./scenes/Examples";
import colors from "./styles/colors";
import sheet from "./styles/sheet";
import { IS_ANDROID } from "./utils";

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

// Android cannot access the MLNModule for some reason, so we need to access the RCTMLNModule directly
if (Platform.OS === "android") {
  NativeModules.RCTMLNModule.setAccessToken(null);
} else {
  NativeModules.MLNModule.setAccessToken(null);
}

export function App() {
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
