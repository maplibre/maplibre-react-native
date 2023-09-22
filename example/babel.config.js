module.exports = {
  presets: [
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      'module-resolver',
      {
        alias: {
          '@turf': './node_modules/@turf',
          '@mapbox': './node_modules/@mapbox',
          debounce: './node_modules/debounce',
          react: './node_modules/react',
          'react-native': './node_modules/react-native',
          '@maplibre/maplibre-react-native': '../javascript',
        },
      },
    ],
  ].filter(Boolean),
};
