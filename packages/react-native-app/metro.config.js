/* eslint-env node */

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
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

const config = {
  projectRoot,
  watchFolders: [
    path.resolve(__dirname, "../../assets"),
    path.resolve(__dirname, "../../javascript"),
    path.resolve(__dirname, "../examples"),
  ],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      },
    ),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(
  withMonorepoPaths(getDefaultConfig(projectRoot)),
  config,
);
