import * as MapLibreRN from "@maplibre/maplibre-react-native";

describe("Package Exports", () => {
  it("should contain all expected components and utils", () => {
    const actualKeys = Object.keys(MapLibreRN);

    const expectedKeys = [
      // Components
      "Map",
      "Callout",
      "Marker",
      "LayerAnnotation",
      "ViewAnnotation",
      "Camera",
      "UserLocation",
      "NativeUserLocation",

      // Hooks
      "useCurrentPosition",

      // Modules
      "OfflineManager",
      "OfflinePack",
      "StaticMapImageManager",
      "LocationManager",
      "LogManager",
      "NetworkManager",

      // Layer
      "Layer",

      // Sources
      "VectorSource",
      "GeoJSONSource",
      "RasterSource",
      "ImageSource",
      "Images",

      // Animated
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
