import { TransformRequestManager } from "@maplibre/maplibre-react-native";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("TransformRequestManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addHeader", () => {
    test("adds header without match pattern", () => {
      TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token123",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        expect.any(String),
        null,
        "Authorization",
        "Bearer token123",
      );
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with string match pattern", () => {
      const pattern = "https:\\/\\/api\\.example\\.com\\/tiles\\/";

      TransformRequestManager.addHeader({
        name: "X-API-Key",
        value: "key123",
        match: pattern,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        expect.any(String),
        pattern,
        "X-API-Key",
        "key123",
      );
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds header with RegExp match pattern", () => {
      const pattern = /https:\/\/api\.example\.com\/tiles\//;

      TransformRequestManager.addHeader({
        name: "X-API-Key",
        value: "key123",
        match: pattern,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        expect.any(String),
        pattern.source,
        "X-API-Key",
        "key123",
      );
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("uses provided id", () => {
      TransformRequestManager.addHeader({
        id: "my-auth-header",
        name: "Authorization",
        value: "Bearer abc",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        "my-auth-header",
        null,
        "Authorization",
        "Bearer abc",
      );
    });

    test("returns the id of the transform", () => {
      const id1 = TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer abc",
      });
      const id2 = TransformRequestManager.addHeader({
        id: "stable-id",
        name: "X-API-Key",
        value: "key",
      });

      expect(typeof id1).toBe("string");
      expect(id2).toBe("stable-id");
    });

    test("handles multiple header names", () => {
      const headers = [
        { name: "Content-Type", value: "application/json" },
        { name: "Accept", value: "application/json" },
        { name: "X-Custom-Header", value: "custom-value" },
        { name: "User-Agent", value: "MyApp/1.0" },
      ];

      headers.forEach((header) => {
        TransformRequestManager.addHeader(header);
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(4);

      headers.forEach((header, index) => {
        expect(
          mockNativeModules.MLRNTransformRequestModule.addHeader,
        ).toHaveBeenNthCalledWith(
          index + 1,
          expect.any(String),
          null,
          header.name,
          header.value,
        );
      });
    });

    test("handles RegExp with special characters", () => {
      const pattern = /^https:\/\/[a-z]+\.example\.(com|org)\/tiles\/\d+\/.*/;

      TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer abc",
        match: pattern,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        expect.any(String),
        pattern.source,
        "Authorization",
        "Bearer abc",
      );
    });

    test("handles empty string pattern as null", () => {
      TransformRequestManager.addHeader({
        name: "Test-Header",
        value: "test-value",
        match: "",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(
        expect.any(String),
        null,
        "Test-Header",
        "test-value",
      );
    });
  });

  describe("removeHeader", () => {
    test("removes header by id", () => {
      const id = TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token",
      });

      TransformRequestManager.removeHeader(id);

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledWith(id);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledTimes(1);
    });

    test("removes header by provided stable id", () => {
      TransformRequestManager.addHeader({
        id: "auth-header",
        name: "Authorization",
        value: "Bearer token",
      });

      TransformRequestManager.removeHeader("auth-header");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledWith("auth-header");
    });

    test("removes multiple headers", () => {
      const ids = ["id-1", "id-2", "id-3", "id-4"];

      ids.forEach((id, i) => {
        TransformRequestManager.addHeader({
          id,
          name: `Header-${i}`,
          value: `value-${i}`,
        });
      });

      ids.forEach((id) => {
        TransformRequestManager.removeHeader(id);
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledTimes(4);

      ids.forEach((id, index) => {
        expect(
          mockNativeModules.MLRNTransformRequestModule.removeHeader,
        ).toHaveBeenNthCalledWith(index + 1, id);
      });
    });
  });

  describe("addUrlSearchParam", () => {
    test("adds URL param without match pattern", () => {
      TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith(
        expect.any(String),
        null,
        "access_token",
        "pk.abc123",
      );
      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("adds URL param with string match pattern", () => {
      const pattern = "api\\.mapbox\\.com";

      TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
        match: pattern,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith(
        expect.any(String),
        pattern,
        "access_token",
        "pk.abc123",
      );
    });

    test("adds URL param with RegExp match pattern", () => {
      const pattern = /api\.mapbox\.com/;

      TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
        match: pattern,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith(
        expect.any(String),
        pattern.source,
        "access_token",
        "pk.abc123",
      );
    });

    test("uses provided id", () => {
      TransformRequestManager.addUrlSearchParam({
        id: "mapbox-token",
        name: "access_token",
        value: "pk.abc123",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith("mapbox-token", null, "access_token", "pk.abc123");
    });

    test("returns the id of the transform", () => {
      const id1 = TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
        match: /mapbox\.com/,
      });
      const id2 = TransformRequestManager.addUrlSearchParam({
        id: "maptiler-key",
        name: "api_key",
        value: "xyz789",
        match: /maptiler\.com/,
      });

      expect(typeof id1).toBe("string");
      expect(id2).toBe("maptiler-key");

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(2);
    });

    test("handles empty string pattern as null", () => {
      TransformRequestManager.addUrlSearchParam({
        name: "key",
        value: "value",
        match: "",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledWith(expect.any(String), null, "key", "value");
    });
  });

  describe("removeUrlSearchParam", () => {
    test("removes URL param by id", () => {
      const id = TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
      });

      TransformRequestManager.removeUrlSearchParam(id);

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledWith(id);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });

    test("removes multiple URL params by id", () => {
      const id1 = TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
      });
      const id2 = TransformRequestManager.addUrlSearchParam({
        name: "api_key",
        value: "xyz",
      });

      TransformRequestManager.removeUrlSearchParam(id1);
      TransformRequestManager.removeUrlSearchParam(id2);

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledTimes(2);
    });

    test("removes by provided stable id", () => {
      TransformRequestManager.addUrlSearchParam({
        id: "mapbox-token",
        name: "access_token",
        value: "pk.abc123",
      });

      TransformRequestManager.removeUrlSearchParam("mapbox-token");

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledWith("mapbox-token");
    });
  });

  describe("integration scenarios", () => {
    test("can add and remove headers in sequence", () => {
      const id1 = TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token1",
      });
      const id2 = TransformRequestManager.addHeader({
        name: "X-API-Key",
        value: "key123",
      });

      TransformRequestManager.removeHeader(id1);

      const id3 = TransformRequestManager.addHeader({
        name: "Content-Type",
        value: "application/json",
      });

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(3);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledWith(id1);
    });

    test("stable id enables in-place update without re-removal", () => {
      TransformRequestManager.addHeader({
        id: "auth",
        name: "Authorization",
        value: "Bearer token-v1",
      });

      // Update token — same id, same pipeline position
      TransformRequestManager.addHeader({
        id: "auth",
        name: "Authorization",
        value: "Bearer token-v2",
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenLastCalledWith(
        "auth",
        null,
        "Authorization",
        "Bearer token-v2",
      );
    });

    test("can add header with pattern, then remove it by id", () => {
      const pattern = /https:\/\/api\.example\.com\/.*/;

      const id = TransformRequestManager.addHeader({
        name: "X-API-Key",
        value: "key123",
        match: pattern,
      });

      TransformRequestManager.removeHeader(id);

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledWith(id, pattern.source, "X-API-Key", "key123");
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledWith(id);
    });

    test("can use URL params for Mapbox and MapTiler authentication", () => {
      const mapboxId = TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.mapbox123",
        match: /api\.mapbox\.com/,
      });

      const maptilerId = TransformRequestManager.addUrlSearchParam({
        name: "key",
        value: "maptiler456",
        match: /api\.maptiler\.com/,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(2);

      TransformRequestManager.removeUrlSearchParam(mapboxId);

      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).toHaveBeenCalledWith(mapboxId);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeUrlSearchParam,
      ).not.toHaveBeenCalledWith(maptilerId);
    });

    test("same param name with different match conditions can coexist", () => {
      // Two entries with same header name but different ids/matches
      const id1 = TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token-a",
        match: /service-a\.example\.com/,
      });
      const id2 = TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token-b",
        match: /service-b\.example\.com/,
      });

      expect(id1).not.toBe(id2);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(2);

      // Remove one without affecting the other
      TransformRequestManager.removeHeader(id1);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).toHaveBeenCalledWith(id1);
      expect(
        mockNativeModules.MLRNTransformRequestModule.removeHeader,
      ).not.toHaveBeenCalledWith(id2);
    });

    test("can combine headers and URL params", () => {
      TransformRequestManager.addHeader({
        name: "Authorization",
        value: "Bearer token",
      });

      TransformRequestManager.addUrlSearchParam({
        name: "access_token",
        value: "pk.abc123",
        match: /mapbox\.com/,
      });

      expect(
        mockNativeModules.MLRNTransformRequestModule.addHeader,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNativeModules.MLRNTransformRequestModule.addUrlSearchParam,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
