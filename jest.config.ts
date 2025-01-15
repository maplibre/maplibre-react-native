import { type Config } from "jest";

const config: Config = {
  preset: "@testing-library/react-native",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: [
    "./src/__tests__/__mocks__/react-native.mock.ts",
    "./src/__tests__/__mocks__/NativeModules.mock.ts",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/lib/",
    "<rootDir>/examples/",
    "__mocks__",
    "__fixtures__",
  ],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
};

module.exports = config;
