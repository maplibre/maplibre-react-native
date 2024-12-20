import { type Config } from "jest";

const config: Config = {
  preset: "@testing-library/react-native",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: [
    "./jest-setup.ts",
    "./__tests__/__mocks__/react-native.mock.ts",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/lib",
    "<rootDir>/packages/*",
    "__tests__/__mocks__",
    "fixtures",
  ],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
};

module.exports = config;
