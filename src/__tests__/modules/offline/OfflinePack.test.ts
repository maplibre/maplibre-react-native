import { OfflinePack } from "../../../modules/offline/OfflinePack";
import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("OfflinePack", () => {
  const fakeNativePack = {
    bounds: [0, 1, 2, 3] as [number, number, number, number], // [west, south, east, north]
    metadata:
      '{"id":"550e8400-e29b-41d4-a716-446655440000","name":"test","data":{"customKey":"customValue"}}',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should contain a valid pack", () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    expect(offlinePack.bounds).toEqual(fakeNativePack.bounds);
    expect(offlinePack.name).toEqual("test");
    expect(offlinePack.metadata).toEqual(JSON.parse(fakeNativePack.metadata));
  });

  describe("id property", () => {
    it("should return id from metadata", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.id).toEqual("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should return empty string when id is not present", () => {
      const legacyPack = {
        bounds: [0, 1, 2, 3] as [number, number, number, number],
        metadata: '{"name":"legacy"}',
      };
      const offlinePack = new OfflinePack(legacyPack);
      expect(offlinePack.id).toEqual("");
    });
  });

  describe("data property", () => {
    it("should return user data from metadata", () => {
      const offlinePack = new OfflinePack(fakeNativePack);
      expect(offlinePack.data).toEqual({ customKey: "customValue" });
    });

    it("should return undefined when data is not present", () => {
      const packWithoutData = {
        bounds: [0, 1, 2, 3] as [number, number, number, number],
        metadata: '{"id":"some-id","name":"test"}',
      };
      const offlinePack = new OfflinePack(packWithoutData);
      expect(offlinePack.data).toBeUndefined();
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

  it("should return null status when id is missing", async () => {
    const legacyPack = {
      bounds: [0, 1, 2, 3] as [number, number, number, number],
      metadata: '{"name":"legacy"}',
    };
    const offlinePack = new OfflinePack(legacyPack);
    const status = await offlinePack.status();
    expect(status).toBeNull();
    expect(
      mockNativeModules.MLRNOfflineModule.getPackStatus,
    ).not.toHaveBeenCalled();
  });
});
