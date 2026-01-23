import * as MapLibreRN from "@maplibre/maplibre-react-native";

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
      "NativeUserLocation",

      // Hooks
      "useCurrentPosition",

      // modules
      "OfflineManager",
      "OfflinePack",
      "SnapshotManager",
      "LocationManager",
      "LogManager",

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
      "GeoJSONSource",
      "RasterSource",
      "ImageSource",
      "Images",

      // Constants
      "StyleURL",
      "StyleSource",

      // Methods

      "addCustomHeader",
      "removeCustomHeader",

      "setConnected",

      // animated
      "Animated",

      // helpers
      // "AnimatedPoint",
      // "AnimatedCoordinatesArray",
      // "AnimatedGeoJSON",
      // "AnimatedExtractCoordinateFromArray",
      // "AnimatedRouteCoordinatesArray",
    ];

    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });
});
