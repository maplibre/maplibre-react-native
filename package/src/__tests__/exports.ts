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

      "LocationManager",
      "LogManager",
      "NetworkManager",
      "OfflineManager",
      "OfflinePack",
      "StaticMapImageManager",
      "TransformRequestManager",

      // Layer
      "Layer",

      // Sources
      "GeoJSONSource",
      "ImageSource",
      "RasterSource",
      "RasterDEMSource",
      "VectorSource",

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
