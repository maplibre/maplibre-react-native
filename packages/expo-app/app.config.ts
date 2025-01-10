import "ts-node/register";
import { type ExpoConfig, type ConfigContext } from "expo/config";

import type { MapLibrePluginProps } from "../../src";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Expo App",
  slug: "maplibre-react-native-expo-example",
  version: "1.0.0",
  newArchEnabled: true,
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#285daa",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "org.maplibre.expo.example",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Permission is necessary to display user location",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "org.maplibre.expo.example",
  },
  androidStatusBar: {
    backgroundColor: "#285daa",
    translucent: false,
  },
  plugins: [
    [
      "../../src/plugin/withMapLibre.ts",
      {
        android: {},
        ios: {},
      } as MapLibrePluginProps,
    ],
  ],
});
