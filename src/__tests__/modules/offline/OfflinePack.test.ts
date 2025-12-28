import { OfflinePack } from "../../../modules/offline/OfflinePack";
import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("OfflinePack", () => {
  const fakeNativePack = {
    bounds: [0, 1, 2, 3] as [number, number, number, number], // [west, south, east, north]
    metadata: '{"name":"test"}',
  };

  const fakeNativePackWithId = {
    bounds: [0, 1, 2, 3] as [number, number, number, number],
    metadata: '{"id":"550e8400-e29b-41d4-a716-446655440000","name":"test"}',
  };

  it("should contain a valid pack", () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    expect(offlinePack.bounds).toEqual(fakeNativePack.bounds);
    expect(offlinePack.name).toEqual("test");
    expect(offlinePack.metadata).toEqual(JSON.parse(fakeNativePack.metadata));
  });

  describe("id property", () => {
    it("should return id when present in metadata", () => {
      const offlinePack = new OfflinePack(fakeNativePackWithId);
      expect(offlinePack.id).toEqual("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should return null when id is not present (legacy packs)", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.id).toBeNull();
    });
  });

  describe("identifier property", () => {
    it("should prefer id over name when id is present", () => {
      const offlinePack = new OfflinePack(fakeNativePackWithId);
      expect(offlinePack.identifier).toEqual(
        "550e8400-e29b-41d4-a716-446655440000",
      );
    });

    it("should fall back to name when id is not present", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.identifier).toEqual("test");
    });
  });

  it("should resume pack download using identifier", async () => {
    const offlinePack = new OfflinePack(fakeNativePackWithId);
    await offlinePack.resume();
    expect(
      mockNativeModules.MLRNOfflineModule.resumePackDownload,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should pause pack download using identifier", async () => {
    const offlinePack = new OfflinePack(fakeNativePackWithId);
    await offlinePack.pause();
    expect(
      mockNativeModules.MLRNOfflineModule.pausePackDownload,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should get pack status using identifier", async () => {
    const offlinePack = new OfflinePack(fakeNativePackWithId);
    await offlinePack.status();
    expect(
      mockNativeModules.MLRNOfflineModule.getPackStatus,
    ).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should fall back to name for legacy packs without id", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.resume();
    expect(
      mockNativeModules.MLRNOfflineModule.resumePackDownload,
    ).toHaveBeenCalledWith("test");
  });
});
