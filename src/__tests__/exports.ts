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
      "NetworkManager",

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

      // animated
      "Animated",

      // helpers
      // "AnimatedPoint",
      // "AnimatedCoordinatesArray",
      // "AnimatedShape",
      // "AnimatedExtractCoordinateFromArray",
      // "AnimatedRouteCoordinatesArray",
    ];

    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });
});
