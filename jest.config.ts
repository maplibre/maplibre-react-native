import { type Config } from "jest";

const config: Config = {
  preset: "react-native",

  moduleNameMapper: {
    // Public
    "^@maplibre/maplibre-react-native$": "<rootDir>/src/index.ts",
    // Internal
    "^@/(.*)$": "<rootDir>/src/$1",
  },
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
