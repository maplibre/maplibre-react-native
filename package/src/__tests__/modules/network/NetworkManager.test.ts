import { TransformRequestManager } from "@maplibre/maplibre-react-native";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("NetworkManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addRequestHeader", () => {
    test("adds header without match pattern", () => {
      TransformRequestManager.addHeader("Authorization", "Bearer token123");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer token123", null);
      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with string match pattern", () => {
      const pattern = "https:\\/\\/api\\.example\\.com\\/tiles\\/";

      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern);
      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with RegExp match pattern", () => {
      const pattern = /https:\/\/api\.example\.com\/tiles\//;

      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern.source);
      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
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
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(4);

      headers.forEach((header, index) => {
        expect(
          mockNativeModules.MLRNNetworkModule.addRequestHeader,
        ).toHaveBeenNthCalledWith(index + 1, header.name, header.value, null);
      });
    });

    test("handles RegExp with special characters", () => {
      const pattern = /^https:\/\/[a-z]+\.example\.(com|org)\/tiles\/\d+\/.*/;

      TransformRequestManager.addHeader("Authorization", "Bearer abc", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer abc", pattern.source);
    });

    test("handles empty string pattern", () => {
      TransformRequestManager.addHeader("Test-Header", "test-value", "");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Test-Header", "test-value", null);
    });
  });

  describe("removeRequestHeader", () => {
    test("removes header by name", () => {
      TransformRequestManager.removeHeader("Authorization");

      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledWith("Authorization");
      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
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
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(4);

      headerNames.forEach((name, index) => {
        expect(
          mockNativeModules.MLRNNetworkModule.removeRequestHeader,
        ).toHaveBeenNthCalledWith(index + 1, name);
      });
    });

    test("handles header names with special characters", () => {
      TransformRequestManager.removeHeader("X-Custom-Header-123");

      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-Custom-Header-123");
    });
  });

  describe("setConnected", () => {
    test("sets connected to true", () => {
      TransformRequestManager.setConnected(true);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("sets connected to false", () => {
      TransformRequestManager.setConnected(false);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(false);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("handles multiple state changes", () => {
      TransformRequestManager.setConnected(true);
      TransformRequestManager.setConnected(false);
      TransformRequestManager.setConnected(true);
      TransformRequestManager.setConnected(false);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(4);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(1, true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(2, false);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(3, true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(4, false);
    });
  });

  describe("addUrlParam", () => {
    test("adds URL param without match pattern", () => {
      TransformRequestManager.addUrlParam("access_token", "pk.abc123");

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", null);
      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds URL param with string match pattern", () => {
      const pattern = "api\\.mapbox\\.com";

      TransformRequestManager.addUrlParam("access_token", "pk.abc123", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", pattern);
    });

    test("adds URL param with RegExp match pattern", () => {
      const pattern = /api\.mapbox\.com/;

      TransformRequestManager.addUrlParam("access_token", "pk.abc123", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledWith("access_token", "pk.abc123", pattern.source);
    });

    test("handles multiple URL params", () => {
      TransformRequestManager.addUrlParam(
        "access_token",
        "pk.abc123",
        /mapbox\.com/,
      );
      TransformRequestManager.addUrlParam("api_key", "xyz789", /maptiler\.com/);

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledTimes(2);
    });

    test("handles empty string pattern", () => {
      TransformRequestManager.addUrlParam("key", "value", "");

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledWith("key", "value", null);
    });
  });

  describe("removeUrlParam", () => {
    test("removes URL param by key", () => {
      TransformRequestManager.removeUrlParam("access_token");

      expect(
        mockNativeModules.MLRNNetworkModule.removeUrlParam,
      ).toHaveBeenCalledWith("access_token");
      expect(
        mockNativeModules.MLRNNetworkModule.removeUrlParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("removes multiple URL params", () => {
      TransformRequestManager.removeUrlParam("access_token");
      TransformRequestManager.removeUrlParam("api_key");

      expect(
        mockNativeModules.MLRNNetworkModule.removeUrlParam,
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
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(3);
      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("can manage headers and connectivity together", () => {
      // Add authentication header
      TransformRequestManager.addHeader("Authorization", "Bearer token");

      // Disable transform-request
      TransformRequestManager.setConnected(false);

      // Add another header while offline
      TransformRequestManager.addHeader("X-Offline-Mode", "true");

      // Re-enable transform-request
      TransformRequestManager.setConnected(true);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(2);
    });

    test("can add header with pattern, then remove it", () => {
      const pattern = /https:\/\/api\.example\.com\/.*/;

      // Add header with pattern
      TransformRequestManager.addHeader("X-API-Key", "key123", pattern);

      // Remove it
      TransformRequestManager.removeHeader("X-API-Key");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern.source);
      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key");
    });

    test("can use URL params for Mapbox authentication", () => {
      // Add access_token for Mapbox URLs
      TransformRequestManager.addUrlParam(
        "access_token",
        "pk.mapbox123",
        /api\.mapbox\.com/,
      );

      // Add api_key for MapTiler URLs
      TransformRequestManager.addUrlParam(
        "key",
        "maptiler456",
        /api\.maptiler\.com/,
      );

      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledTimes(2);

      // Remove Mapbox token
      TransformRequestManager.removeUrlParam("access_token");

      expect(
        mockNativeModules.MLRNNetworkModule.removeUrlParam,
      ).toHaveBeenCalledWith("access_token");
    });

    test("can combine headers and URL params", () => {
      // Add authentication header
      TransformRequestManager.addHeader("Authorization", "Bearer token");

      // Add URL param for a different service
      TransformRequestManager.addUrlParam(
        "access_token",
        "pk.abc123",
        /mapbox\.com/,
      );

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNativeModules.MLRNNetworkModule.addUrlParam,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
