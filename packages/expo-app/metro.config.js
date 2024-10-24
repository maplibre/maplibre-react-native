/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/**
 * @param config {import('expo/metro-config').MetroConfig}
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

  return config;
}

module.exports = withMonorepoPaths(getDefaultConfig(projectRoot));
