import * as MapLibreRN from "@maplibre/maplibre-react-native";

describe("Package Exports", () => {
  it("should contain all expected components and utils", () => {
    const actualKeys = Object.keys(MapLibreRN);

    const expectedKeys = [
      // Components
      "Map",
      "PointAnnotation",
      "Marker",
      "Callout",
      "GeoJSONSourceAnnotation",
      "Camera",
      "UserLocation",
      "NativeUserLocation",

      // Hooks
      "useCurrentPosition",

      // modules
      "OfflineManager",
      "OfflinePack",
      "StaticMapImageManager",
      "LocationManager",
      "LogManager",
      "NetworkManager",

      // layers
      "Layer",

      // Sources
      "VectorSource",
      "GeoJSONSource",
      "RasterSource",
      "ImageSource",
      "Images",

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
