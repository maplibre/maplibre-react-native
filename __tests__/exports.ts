import MapLibreGL from "../src";

describe("Package Exports", () => {
  it("should contain all expected components and utils", () => {
    const actualKeys = Object.keys(MapLibreGL);

    const expectedKeys = [
      // Components
      "MapView",
      "Light",
      "PointAnnotation",
      "MarkerView",
      "Annotation",
      "Callout",
      "Camera",
      "UserLocation",

      // modules
      "offlineManager",
      "OfflineCreatePackOptions",
      "OfflinePack",
      "snapshotManager",
      "locationManager",

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
      "UserTrackingMode",
      "UserLocationRenderMode",
      "StyleURL",
      // "EventTypes",
      "CameraModes",
      "StyleSource",
      "LineJoin",

      "OfflinePackDownloadState",
      // "OfflineCallbackName",

      // Methods

      "setAccessToken",
      "getAccessToken",

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
