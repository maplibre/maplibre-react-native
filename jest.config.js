module.exports = {
  preset: "@testing-library/react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: ["./jest-setup.ts"],
  setupFiles: ["./__tests__/__mocks__/react-native.mock.js"],
  modulePathIgnorePatterns: ["__tests__/__mocks__", "fixtures"],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
};
