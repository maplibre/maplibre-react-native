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
  const metroConfig = wrapWithReanimatedMetroConfig(
    withMetroConfig(config, {
      root,
      dirname: project,
    }),
  );

  console.log(path.resolve(__dirname, "src"));
  console.log(metroConfig.resolver?.extraNodeModules);

  // Add resolver for @ alias to map to library source
  return {
    ...metroConfig,
    resolver: {
      ...metroConfig.resolver,
      extraNodeModules: {
        ...metroConfig.resolver?.extraNodeModules,
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
}

exports.withMetroShared = withMetroShared;
