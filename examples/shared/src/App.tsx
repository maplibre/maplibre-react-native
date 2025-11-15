import { LocationManager } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { LogBox, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import { Home } from "./Examples";
import { sheet } from "./styles/sheet";

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

const IS_ANDROID = Platform.OS === "android";

export function App() {
  const [permissions, setPermissions] = useState(IS_ANDROID ? undefined : true);

  useEffect(() => {
    (async () => {
      if (IS_ANDROID) {
        setPermissions(await LocationManager.requestAndroidPermissions());
      }
    })();
  }, []);

  if (permissions === undefined) {
    return null;
  }

  if (!permissions) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={sheet.matchParent}>
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
