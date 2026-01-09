import {
  OfflineManager,
  OfflinePackDownloadState,
} from "../../../modules/offline/OfflineManager";
import type { LngLatBounds } from "../../../types/LngLatBounds";
import {
  mockNativeModules,
  mockNativeModuleSubscription,
} from "../../__mocks__/NativeModules.mock";

describe("OfflineManager", () => {
  const packOptions = {
    name: "test",
    styleURL: "https://demotiles.maplibre.org/style.json",
    bounds: [0, 1, 2, 3] as LngLatBounds,
    minZoom: 1,
    maxZoom: 22,
  };

  const mockOnProgressEvent = {
    name: packOptions.name,
    state: OfflinePackDownloadState.Active,
    percentage: 50.0,
    completedResourceCount: 50,
    completedResourceSize: 1000,
    completedTileCount: 25,
    completedTileSize: 500,
    requiredResourceCount: 100,
  };

  const mockOnProgressCompleteEvent = {
    name: packOptions.name,
    state: OfflinePackDownloadState.Complete,
    percentage: 100.0,
    completedResourceCount: 100,
    completedResourceSize: 2000,
    completedTileCount: 50,
    completedTileSize: 1000,
    requiredResourceCount: 100,
  };

  const mockErrorEvent = {
    name: packOptions.name,
    message: "unit test error",
  };

  afterEach(async () => {
    const packs = await OfflineManager.getPacks();
    for (const pack of packs) {
      if (pack.name) {
        await OfflineManager.deletePack(pack.name);
      }
    }

    // Reset listener state using bracket notation
    OfflineManager["hasInitialized"] = false;
    OfflineManager["offlinePacks"] = {};
    OfflineManager["progressListeners"] = {};
    OfflineManager["errorListeners"] = {};
    OfflineManager["subscriptionProgress"] = null;
    OfflineManager["subscriptionError"] = null;

    jest.clearAllMocks();
  });

  it("should create pack", async () => {
    let offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();

    await OfflineManager.createPack(packOptions, jest.fn(), jest.fn());
    offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();
  });

  it("should delete pack", async () => {
    await OfflineManager.createPack(packOptions, jest.fn(), jest.fn());
    let offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();

    await OfflineManager.deletePack(packOptions.name);
    offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();
  });

  it("should set max tile count limit", () => {
    const expectedLimit = 2000;
    OfflineManager.setTileCountLimit(expectedLimit);
    expect(
      mockNativeModules.MLRNOfflineModule.setTileCountLimit,
    ).toHaveBeenCalledWith(expectedLimit);
  });

  it("should set progress event throttle value", () => {
    const expectedThrottleValue = 500;
    OfflineManager.setProgressEventThrottle(expectedThrottleValue);
    expect(
      mockNativeModules.MLRNOfflineModule.setProgressEventThrottle,
    ).toHaveBeenCalledWith(expectedThrottleValue);
  });

  describe("Events", () => {
    it("should subscribe to native events", async () => {
      const noop = jest.fn();
      await OfflineManager.createPack(packOptions, noop, noop);
      expect(
        mockNativeModules.MLRNOfflineModule.onProgress,
      ).toHaveBeenCalledTimes(1);
      expect(mockNativeModules.MLRNOfflineModule.onError).toHaveBeenCalledTimes(
        1,
      );
    });

    it("should call progress listener", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener, jest.fn());
      const expectedOfflinePack = await OfflineManager.getPack(
        packOptions.name,
      );
      OfflineManager["onProgress"](mockOnProgressEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockOnProgressEvent,
      );
    });

    it("should call error listener", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, jest.fn(), listener);
      const expectedOfflinePack = await OfflineManager.getPack(
        packOptions.name,
      );
      OfflineManager["onError"](mockErrorEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockErrorEvent,
      );
    });

    it("should not call listeners after unsubscribe", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener, listener);
      OfflineManager.unsubscribe(packOptions.name);
      OfflineManager["onProgress"](mockOnProgressEvent);
      OfflineManager["onError"](mockErrorEvent);
      expect(listener).not.toHaveBeenCalled();
    });

    it("should unsubscribe from native events", async () => {
      const noop = jest.fn();

      await OfflineManager.createPack(packOptions, noop, noop);
      OfflineManager.unsubscribe(packOptions.name);

      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(2);
    });

    it("should unsubscribe event listeners once a pack download has completed", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener, listener);

      expect(
        OfflineManager["hasListeners"](
          packOptions.name,
          OfflineManager["progressListeners"],
        ),
      ).toBeTruthy();

      expect(
        OfflineManager["hasListeners"](
          packOptions.name,
          OfflineManager["errorListeners"],
        ),
      ).toBeTruthy();

      OfflineManager["onProgress"](mockOnProgressCompleteEvent);

      expect(
        OfflineManager["hasListeners"](
          packOptions.name,
          OfflineManager["progressListeners"],
        ),
      ).toBeFalsy();

      expect(
        OfflineManager["hasListeners"](
          packOptions.name,
          OfflineManager["errorListeners"],
        ),
      ).toBeFalsy();
    });
  });

  describe("Pack Observer", () => {
    it("should set pack observer when subscribing to existing pack", async () => {
      const name = `test-${Date.now()}`;
      const noop = jest.fn();
      const options = { ...packOptions, name };
      await OfflineManager.createPack(options, jest.fn(), jest.fn());
      jest.clearAllMocks();

      await OfflineManager.subscribe(name, noop, noop);

      expect(
        mockNativeModules.MLRNOfflineModule.setPackObserver,
      ).toHaveBeenCalledWith(name);
    });

    it("should not set pack observer manually during create flow", async () => {
      const name = `test-${Date.now()}`;
      const noop = jest.fn();
      const options = { ...packOptions, name };
      await OfflineManager.createPack(options, noop, noop);

      // setPackObserver should only be called from subscribe when pack already exists,
      // not during the create flow since pack doesn't exist yet when subscribe is called
      expect(
        mockNativeModules.MLRNOfflineModule.setPackObserver,
      ).not.toHaveBeenCalled();
    });
  });
});
