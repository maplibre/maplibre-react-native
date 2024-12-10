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

      // sources
      "VectorSource",
      "ShapeSource",
      "RasterSource",
      "ImageSource",
      "Images",

      // constants
      "UserTrackingMode",
      "UserLocationRenderMode",
      "StyleURL",
      // "EventTypes",
      "CameraModes",
      "StyleSource",
      // "InterpolationMode",
      "LineJoin",
      // "LineCap",
      // "LineTranslateAnchor",
      // "CirclePitchScale",
      // "CircleTranslateAnchor",
      // 'CirclePitchAlignment',
      // "FillExtrusionTranslateAnchor",
      // "FillTranslateAnchor",
      // "IconRotationAlignment",
      // "IconTextFit",
      // 'IconAnchor',
      // "IconTranslateAnchor",
      // 'IconPitchAlignment',
      // "SymbolPlacement",
      // "TextAnchor",
      // "TextJustify",
      // "TextPitchAlignment",
      // "TextRotationAlignment",
      // "TextTransform",
      // "TextTranslateAnchor",
      // "LightAnchor",

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
