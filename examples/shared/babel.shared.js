/* eslint-env node */
const pkg = require("@maplibre/maplibre-react-native/package.json");
const path = require("node:path");
const {
  getConfig: getBobConfig,
} = require("react-native-builder-bob/babel-config");

const root = path.resolve(__dirname, "..", "..");

function withBabelShared(preset) {
  return getBobConfig(
    {
      presets: [preset],
      plugins: [
        "@babel/plugin-transform-export-namespace-from",
        [
          "module-resolver",
          {
            extensions: [".js", ".ts", ".json", ".jsx", ".tsx"],
            alias: {
              "@": path.resolve(__dirname, "src"),
            },
          },
        ],
        "react-native-worklets/plugin",
      ],
    },
    { root, pkg },
  );
}
exports.withBabelShared = withBabelShared;
