<p align="center">
  <a href="src/examples/FillRasterLayer/ChoroplethLayerByZoomLevel.js">
    <img src="readme_assets/example_choropleth_layer.png" width="175"/>
  </a>
  <a href="src/examples/SymbolCircleLayer/EarthQuakes.js">
    <img src="readme_assets/example_clustering_earthquakes.png" width="175"/>
  </a>
  <a href="src/examples/Annotations/CustomCallout.tsx">
    <img src="readme_assets/example_custom_callout.png" width="175"/>
  </a>
  <a href="src/examples/SymbolCircleLayer/DataDrivenCircleColors.js">
    <img src="readme_assets/example_data_driven_circle_colors.png" width="175"/>
  </a>
  <a href="src/examples/FillRasterLayer/ImageOverlay.js">
    <img src="readme_assets/example_image_overlay.png" width="175"/>
  </a>
</p>

# React Native MapLibre GL Demo

TODO: See if we can rework this; maybe something like yalc can help? Or fork examples to a separate repo? That feels even better and less hackish.

*Note:* this app is using [non-trivial babel/metro configs](https://github.com/rnmapbox/maps/pull/778), so we can consume the library from parent directory directly. Regular apps don't need this complicated setup.

## Installation

* Make sure you are in the example directory
```
cd example
```

* Install our dependencies using `yarn install`.

## Start React Native Packager (or not, it starts automatically 🤷‍♀️)

Open up another tab in your Terminal and run
```
yarn start
```

*Note*: if modules were added to base lib you might need to run `yarn start --reset-cache` because we're using `babel` to [rewrite imports](https://github.com/rnmapbox/maps/pull/778)

<br>

## Run Android Emulator

* Run `yarn android`

## Run iOS Simulator

You can run this with the react-native cli or by opening the Xcode project

* Run `yarn pod:install` if this is your first time to install pods
* Run `yarn ios`
