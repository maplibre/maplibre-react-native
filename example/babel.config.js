module.exports = {
  presets: [
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    ['module-resolver'],
  ].filter(Boolean),
};
