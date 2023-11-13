// Learn more https://docs.expo.dev/guides/monorepos
const path = require('path');

const {getDefaultConfig} = require('expo/metro-config');
const {FileStore} = require('metro-cache');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);

// This is not needed for NativeWind, it is configuration for Metro to understand monorepos
// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];
// #3 - Force resolving nested modules to the folders below
config.resolver.disableHierarchicalLookup = true;
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

// 2. Enable NativeWind

module.exports = config;
