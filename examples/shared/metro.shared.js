/* eslint-env node */
const path = require("node:path");
const { getConfig } = require("react-native-builder-bob/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const pkg = require("../../package.json");
const root = path.resolve(__dirname, "..", "..");

/**
 * @param {import('metro-config').MetroConfig} config
 * @param {object} options
 * @param {string} options.project
 * @returns {import('metro-config').MetroConfig}
 */
function withMetroShared(config, { project }) {
  config = getConfig(config, {
    root,
    pkg,
    project,
  });

  // Watch all files in the monorepo
  config.watchFolders = [root];

  // Set `node_modules` to resolve
  config.resolver.nodeModulesPaths = [
    path.resolve(project, "node_modules"),
    path.resolve(__dirname, "node_modules"),
    path.resolve(root, "node_modules"),
  ];

  // Resolve only (sub)dependencies from the `nodeModulesPaths`
  config.resolver.disableHierarchicalLookup = true;

  // Use src instead of lib
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith(pkg.name)) {
      return {
        filePath: path.resolve(root, "src", "index.ts"),
        type: "sourceFile",
      };
    }

    return context.resolveRequest(context, moduleName, platform);
  };

  return wrapWithReanimatedMetroConfig(
    getConfig(config, {
      root,
      pkg,
      project,
    }),
  );
}

exports.withMetroShared = withMetroShared;
