import { LocationManager } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import { Home } from "@/Examples";
import { colors } from "@/styles/colors";

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },

  permissionsView: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  permissionsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },

  permissionsButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.blue,
    borderRadius: 8,
  },
  permissionsButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export function App() {
  const [permissions, setPermissions] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      setPermissions(await LocationManager.requestPermissions());
    })();
  }, []);

  if (permissions === undefined) {
    return null;
  }

  if (!permissions) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.flex1}>
          <View style={styles.permissionsView}>
            <Text style={styles.permissionsText}>
              You need to grant location permissions in order to use the example
              application.
            </Text>

            <TouchableOpacity
              style={styles.permissionsButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.permissionsButtonText}>Open Settings</Text>
            </TouchableOpacity>
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
