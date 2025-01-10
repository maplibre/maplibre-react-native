import { type ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

import type { MapLibrePluginProps } from "./MapLibrePluginProps";
import { android } from "./android";
import { ios } from "./ios";

let pkg: { name: string; version?: string } = {
  name: "@maplibre/maplibre-react-native",
};
try {
  pkg = require("@maplibre/maplibre-react-native/package.json");
} catch {
  // empty catch block
}

const withMapLibre: ConfigPlugin<MapLibrePluginProps> = (config, props) => {
  // Android
  config = android.withGradleProperties(config, props);

  // iOS
  config = ios.withExcludedSimulatorArchitectures(config);
  config = ios.withDwarfDsym(config);
  config = ios.withoutSignatures(config);
  config = ios.withPodfileGlobalVariables(config, props);
  config = ios.withPodfilePostInstall(config);

  return config;
};

export default createRunOncePlugin(withMapLibre, pkg.name, pkg.version);
