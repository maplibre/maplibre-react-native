import { LocationManager } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import { Home } from "./Examples";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
        <SafeAreaView style={styles.flex1}>
          <Text style={styles.noPermissionsText}>
            You need to accept location permissions in order to use this example
            applications
          </Text>
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
