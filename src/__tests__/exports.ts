import * as MapLibreRN from "..";

describe("Package Exports", () => {
  it("should contain all expected components and utils", () => {
    const actualKeys = Object.keys(MapLibreRN);

    const expectedKeys = [
      // Components
      "MapView",
      "PointAnnotation",
      "MarkerView",
      "Annotation",
      "Callout",
      "Camera",
      "UserLocation",

      // modules
      "OfflineManager",
      "OfflineCreatePackOptions",
      "OfflinePack",
      "SnapshotManager",
      "LocationManager",

      // layers
      "FillLayer",
      "FillExtrusionLayer",
      "CircleLayer",
      "HeatmapLayer",
      "LineLayer",
      "SymbolLayer",
      "BackgroundLayer",
      "RasterLayer",

      // Sources
      "VectorSource",
      "ShapeSource",
      "RasterSource",
      "ImageSource",
      "Images",

      // Constants
      "StyleURL",
      "StyleSource",
      "OfflinePackDownloadState",

      // Methods

      "addCustomHeader",
      "removeCustomHeader",

      "setConnected",
      "requestAndroidLocationPermissions",

      // animated
      "Animated",

      // helpers
      // "AnimatedPoint",
      // "AnimatedCoordinatesArray",
      // "AnimatedShape",
      // "AnimatedExtractCoordinateFromArray",
      // "AnimatedRouteCoordinatesArray",
      "Logger",
    ];

    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });
});
