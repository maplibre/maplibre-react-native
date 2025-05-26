/* eslint-env node */
const path = require("node:path");
const { withMetroConfig } = require("react-native-monorepo-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const root = path.resolve(__dirname, "..", "..");

/**
 * @param {import("metro-config").MetroConfig} config
 * @param {object} options
 * @param {string} options.project
 * @returns {import("metro-config").MetroConfig}
 */
function withMetroShared(config, { project }) {
  return wrapWithReanimatedMetroConfig(
    withMetroConfig(config, {
      root,
      dirname: project,
    }),
  );
}

exports.withMetroShared = withMetroShared;
