/* eslint-env node */

// Learn more https://docs.expo.io/guides/customizing-metro
/** @type {import('expo/metro-config').MetroConfig} */

const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

require("@expo/env").load(workspaceRoot, { force: true });

const config = getDefaultConfig(__dirname);

function withAssets(config) {
  const { transformer, resolver } = config;
  config.transformer = {
    ...transformer,
    //babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    // assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    // sourceExts: [...resolver.sourceExts, 'mjs', 'cjs', 'svg'],
  };
  // Remove console logs
  config.transformer.minifierConfig.compress.drop_console = true;
  return config;
}

/**
 * Add the monorepo paths to the Metro config.
 * This allows Metro to resolve modules from the monorepo.
 *
 * @see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
  // #1 - Watch all files in the monorepo
  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  // #3 - Force resolving nested modules to the folders below
  config.resolver.disableHierarchicalLookup = true;

  return config;
}

/**
 * Move the Metro cache to the `node_modules/.cache/metro` folder.
 * This repository configured Turborepo to use this cache location as well.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */ // eslint-disable-next-line no-unused-vars
function withTurborepoManagedCache(config) {
  config.cacheStores = [
    new FileStore({ root: path.join(__dirname, "node_modules/.cache/metro") }),
  ];
  return config;
}

module.exports = withMonorepoPaths(withAssets(config));
