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
      plugins: [
        "@babel/plugin-transform-export-namespace-from",
        "react-native-reanimated/plugin",
        [
          "module-resolver",
          {
            extensions: [".js", ".ts", ".json", ".jsx", ".tsx"],
            alias: {
              "@": path.resolve(__dirname, "src"),
            },
          },
        ],
      ],
    },
    { root, pkg },
  );
}
exports.withBabelShared = withBabelShared;
