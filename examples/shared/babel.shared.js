/* eslint-env node */
const path = require("node:path");
const {
  getConfig: getBobConfig,
} = require("react-native-builder-bob/babel-config");

const pkg = require("../../package.json");

const root = path.resolve(__dirname, "..", "..");

function withBabelShared(preset) {
  return getBobConfig(
    {
      presets: [preset],
      plugins: ["react-native-reanimated/plugin"],
    },
    { root, pkg },
  );
}
exports.withBabelShared = withBabelShared;
