import { TransformRequestManager } from "@maplibre/maplibre-react-native";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("TransformRequestManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addRequestHeader", () => {
    test("adds header without match pattern", () => {
      TransformRequestManager.addHeader("Authorization", "Bearer token123");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer token123", null);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with string match pattern", () => {
      const pattern = "https:\\/\\/api\\.example\\.com\\/tiles\\/";

      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with RegExp match pattern", () => {
      const pattern = /https:\/\/api\.example\.com\/tiles\//;

      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern.source);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("handles various header names and values", () => {
      const headers = [
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "application/json" },
        { name: "X-Custom-Header", value: "custom-value" },
        { name: "User-Agent", value: "MyApp/1.0" },
      ];

      headers.forEach((header) => {
        TransformRequestManager.addHeader(header.name, header.value);
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(4);

      headers.forEach((header, index) => {
        expect(
          mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
        ).toHaveBeenNthCalledWith(index + 1, header.name, header.value, null);
      });
    });

    test("handles RegExp with special characters", () => {
      const pattern = /^https:\/\/[a-z]+\.example\.(com|org)\/tiles\/\d+\/.*/;

      TransformRequestManager.addHeader("Authorization", "Bearer abc", pattern);

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer abc", pattern.source);
    });

    test("handles empty string pattern", () => {
      TransformRequestManager.addHeader("Test-Header", "test-value", "");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("Test-Header", "test-value", null);
    });
  });

  describe("removeRequestHeader", () => {
    test("removes header by name", () => {
      TransformRequestManager.removeHeader("Authorization");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledWith("Authorization");
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("removes multiple headers", () => {
      const headerNames = [
        "Authorization",
        "X-API-Key",
        "Content-Type",
        "Accept",
      ];

      headerNames.forEach((name) => {
        TransformRequestManager.removeHeader(name);
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(4);

      headerNames.forEach((name, index) => {
        expect(
          mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
        ).toHaveBeenNthCalledWith(index + 1, name);
      });
    });

    test("handles header names with special characters", () => {
      TransformRequestManager.removeHeader("X-Custom-Header-123");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-Custom-Header-123");
    });
  });

  describe("addUrlSearchParam", () => {
    test("adds URL param without match pattern", () => {
      TransformRequestManager.addUrlSearchParam("access_token", "pk.abc123");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", null);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds URL param with string match pattern", () => {
      const pattern = "api\\.mapbox\\.com";

      TransformRequestManager.addUrlSearchParam(
        "access_token",
        "pk.abc123",
        pattern,
      );

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", pattern);
    });

    test("adds URL param with RegExp match pattern", () => {
      const pattern = /api\.mapbox\.com/;

      TransformRequestManager.addUrlSearchParam(
        "access_token",
        "pk.abc123",
        pattern,
      );

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", pattern.source);
    });

    test("handles multiple URL params", () => {
      TransformRequestManager.addUrlSearchParam(
        "access_token",
        "pk.abc123",
        /mapbox\.com/,
      );
      TransformRequestManager.addUrlSearchParam(
        "api_key",
        "xyz789",
        /maptiler\.com/,
      );

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(2);
    });

    test("handles empty string pattern", () => {
      TransformRequestManager.addUrlSearchParam("key", "value", "");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith("key", "value", null);
    });
  });

  describe("removeUrlSearchParam", () => {
    test("removes URL param by key", () => {
      TransformRequestManager.removeUrlSearchParam("access_token");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledWith("access_token");
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("removes multiple URL params", () => {
      TransformRequestManager.removeUrlSearchParam("access_token");
      TransformRequestManager.removeUrlSearchParam("api_key");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledTimes(2);
    });
  });

  describe("integration scenarios", () => {
    test("can add and remove headers in sequence", () => {
      // Add headers
      TransformRequestManager.addHeader("Authorization", "Bearer token1");
      TransformRequestManager.addHeader("X-API-Key", "key123");

      // Remove one header
      TransformRequestManager.removeHeader("Authorization");

      // Add another header
      TransformRequestManager.addHeader("Content-Type", "application/json");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(3);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("can add header with pattern, then remove it", () => {
      const pattern = /https:\/\/api\.example\.com\/.*/;

      // Add header with pattern
      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      // Remove it
      TransformRequestManager.removeHeader("X-API-Key");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern.source);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key");
    });

    test("can use URL params for Mapbox authentication", () => {
      // Add access_token for Mapbox URLs
      TransformRequestManager.addUrlSearchParam(
        "access_token",
        "pk.mapbox123",
        /api\.mapbox\.com/,
      );

      // Add api_key for MapTiler URLs
      TransformRequestManager.addUrlSearchParam(
        "key",
        "maptiler456",
        /api\.maptiler\.com/,
      );

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(2);

      // Remove Mapbox token
      TransformRequestManager.removeUrlSearchParam("access_token");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledWith("access_token");
    });

    test("can combine headers and URL params", () => {
      // Add authentication header
      TransformRequestManager.addHeader("Authorization", "Bearer token");

      // Add URL param for a different service
      TransformRequestManager.addUrlSearchParam(
        "access_token",
        "pk.abc123",
        /mapbox\.com/,
      );

      expect(
        mockNativeModules.MLRNTransformRequestModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
