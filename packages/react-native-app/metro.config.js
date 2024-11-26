/* eslint-env node */
const {
  withMonorepoPaths,
} = require("@maplibre-react-native/examples/MetroWithMonorepoPaths");
const { getDefaultConfig } = require("@react-native/metro-config");

const project = __dirname;

module.exports = withMonorepoPaths(getDefaultConfig(project), { project });
