/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { getConfig } = require("react-native-builder-bob/metro-config");

const pkg = require("../../package.json");

const project = __dirname;
const root = path.resolve(project, "..", "..");

/**
 * @param config {import('expo/metro-config').MetroConfig}
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
  // Watch all files in the monorepo
  config.watchFolders = [root];

  // Set `node_modules` to resolve
  config.resolver.nodeModulesPaths = [
    path.resolve(project, "node_modules"),
    path.resolve(root, "packages/examples/node_modules"),
    path.resolve(root, "node_modules"),
  ];

  // Resolve only (sub)dependencies from the `nodeModulesPaths`
  config.resolver.disableHierarchicalLookup = true;

  // Use src instead of lib
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith(pkg.name)) {
      return {
        filePath: path.resolve(__dirname, "..", "..", "src", "index.ts"),
        type: "sourceFile",
      };
    }

    return context.resolveRequest(context, moduleName, platform);
  };

  return config;
}

module.exports = withMonorepoPaths(
  getConfig(getDefaultConfig(project), {
    root,
    pkg,
    project,
  }),
);
