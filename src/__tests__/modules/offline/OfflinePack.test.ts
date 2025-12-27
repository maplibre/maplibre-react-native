import { OfflinePack } from "../../../modules/offline/OfflinePack";
import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("OfflinePack", () => {
  const fakeNativePack = {
    bounds: [
      [0, 1],
      [2, 3],
    ] as readonly (readonly number[])[],
    metadata: '{"name":"test"}',
  };

  it("should contain a valid pack", () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    expect(offlinePack.bounds).toEqual(fakeNativePack.bounds);
    expect(offlinePack.name).toEqual("test");
    expect(offlinePack.metadata).toEqual(JSON.parse(fakeNativePack.metadata));
  });

  it("should resume pack download", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.resume();
    expect(
      mockNativeModules.MLRNOfflineModule.resumePackDownload,
    ).toHaveBeenCalled();
  });

  it("should pause pack download", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.pause();
    expect(
      mockNativeModules.MLRNOfflineModule.pausePackDownload,
    ).toHaveBeenCalled();
  });

  it("should get pack status", async () => {
    const offlinePack = new OfflinePack(fakeNativePack);
    await offlinePack.status();
    expect(
      mockNativeModules.MLRNOfflineModule.getPackStatus,
    ).toHaveBeenCalled();
  });
});
