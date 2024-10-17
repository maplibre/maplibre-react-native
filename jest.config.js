/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "react-native",
  collectCoverageFrom: ["javascript/**/*.js"],
  setupFiles: ["./setup-jest.js", "./__tests__/__mocks__/react-native.mock.js"],
  modulePathIgnorePatterns: ["example", "__tests__/__mocks__", "fixtures"],
};
