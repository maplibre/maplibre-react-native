import { NetworkManager } from "@maplibre/maplibre-react-native";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("NetworkManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addRequestHeader", () => {
    test("adds header without match pattern", () => {
      NetworkManager.addRequestHeader("Authorization", "Bearer token123");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer token123", null);
      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with string match pattern", () => {
      const pattern = "https:\\/\\/api\\.example\\.com\\/tiles\\/";

      NetworkManager.addRequestHeader("X-API-Key", "key123", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern);
      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with RegExp match pattern", () => {
      const pattern = /https:\/\/api\.example\.com\/tiles\//;

      NetworkManager.addRequestHeader("X-API-Key", "key123", pattern);

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
        NetworkManager.addRequestHeader(header.name, header.value);
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

      NetworkManager.addRequestHeader("Authorization", "Bearer abc", pattern);

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Authorization", "Bearer abc", pattern.source);
    });

    test("handles empty string pattern", () => {
      NetworkManager.addRequestHeader("Test-Header", "test-value", "");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("Test-Header", "test-value", null);
    });
  });

  describe("removeRequestHeader", () => {
    test("removes header by name", () => {
      NetworkManager.removeRequestHeader("Authorization");

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
        NetworkManager.removeRequestHeader(name);
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
      NetworkManager.removeRequestHeader("X-Custom-Header-123");

      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-Custom-Header-123");
    });
  });

  describe("setConnected", () => {
    test("sets connected to true", () => {
      NetworkManager.setConnected(true);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("sets connected to false", () => {
      NetworkManager.setConnected(false);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(false);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("handles multiple state changes", () => {
      NetworkManager.setConnected(true);
      NetworkManager.setConnected(false);
      NetworkManager.setConnected(true);
      NetworkManager.setConnected(false);

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

  describe("integration scenarios", () => {
    test("can add and remove headers in sequence", () => {
      // Add headers
      NetworkManager.addRequestHeader("Authorization", "Bearer token1");
      NetworkManager.addRequestHeader("X-API-Key", "key123");

      // Remove one header
      NetworkManager.removeRequestHeader("Authorization");

      // Add another header
      NetworkManager.addRequestHeader("Content-Type", "application/json");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledTimes(3);
      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("can manage headers and connectivity together", () => {
      // Add authentication header
      NetworkManager.addRequestHeader("Authorization", "Bearer token");

      // Disable network
      NetworkManager.setConnected(false);

      // Add another header while offline
      NetworkManager.addRequestHeader("X-Offline-Mode", "true");

      // Re-enable network
      NetworkManager.setConnected(true);

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
      NetworkManager.addRequestHeader("X-API-Key", "key123", pattern);

      // Remove it
      NetworkManager.removeRequestHeader("X-API-Key");

      expect(
        mockNativeModules.MLRNNetworkModule.addRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key", "key123", pattern.source);
      expect(
        mockNativeModules.MLRNNetworkModule.removeRequestHeader,
      ).toHaveBeenCalledWith("X-API-Key");
    });
  });
});
