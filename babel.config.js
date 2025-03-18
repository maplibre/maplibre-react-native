module.exports = {
  presets: [
    // https://github.com/facebook/react-native/issues/46355#issuecomment-2602102437
    process.env.NODE_ENV === "test"
      ? "module:@react-native/babel-preset"
      : [
          "module:react-native-builder-bob/babel-preset",
          { modules: "commonjs" },
        ],
  ],
};
