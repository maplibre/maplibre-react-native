import MapLibreRN from "..";

describe("Package Exports", () => {
  it("should contain all expected components and utils", () => {
    const actualKeys = Object.keys(MapLibreRN);

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
      "OfflineManager",
      "OfflineCreatePackOptions",
      "OfflinePack",
      "SnapshotManager",
      "LocationManager",

      // deprecated
      "offlineManager",
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
      "CameraModes",
      "StyleURL",
      "StyleSource",
      "OfflinePackDownloadState",

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
