/* eslint-env node */
const { getDefaultConfig } = require("@react-native/metro-config");
const path = require("path");
const { getConfig } = require("react-native-builder-bob/metro-config");

const root = path.resolve(__dirname, "..", "..");
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const pkg = require("../../package.json");

/**
 * @param config {import('metro-config').MetroConfig}
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
  // Watch all files in the monorepo
  config.watchFolders = [workspaceRoot];

  // Set `node_modules` to resolve
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "packages/examples/node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  // Resolve only (sub)dependencies from the `nodeModulesPaths`
  config.resolver.disableHierarchicalLookup = true;

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
  getConfig(getDefaultConfig(projectRoot), {
    root,
    pkg,
    project: __dirname,
  }),
);
