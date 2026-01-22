import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

import { OfflinePack } from "@/modules/offline/OfflinePack";

describe("OfflinePack", () => {
  const fakeNativePack = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    bounds: [0, 1, 2, 3] as [number, number, number, number], // [west, south, east, north]
    metadata: '{"customKey":"customValue"}',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should contain a valid pack", () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    expect(offlinePack.id).toEqual("550e8400-e29b-41d4-a716-446655440000");
    expect(offlinePack.bounds).toEqual(fakeNativePack.bounds);
    expect(offlinePack.metadata).toEqual({ customKey: "customValue" });
  });

  describe("id property", () => {
    it("should return id from native pack", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.id).toEqual("550e8400-e29b-41d4-a716-446655440000");
    });
  });

  describe("metadata property", () => {
    it("should parse metadata JSON string", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.metadata).toEqual({ customKey: "customValue" });
    });

    it("should handle empty metadata", () => {
      const packWithoutMetadata = {
        id: "test-id",
        bounds: [0, 1, 2, 3] as [number, number, number, number],
        metadata: "{}",
      };
      const offlinePack = new OfflinePack(packWithoutMetadata);
      expect(offlinePack.metadata).toEqual({});
    });
  });

  it("should resume pack download using id", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.resume();
    expect(
      mockNativeModules.MLRNOfflineModule.resumePackDownload,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should pause pack download using id", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.pause();
    expect(
      mockNativeModules.MLRNOfflineModule.pausePackDownload,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should get pack status using id", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.status();
    expect(
      mockNativeModules.MLRNOfflineModule.getPackStatus,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });
});
