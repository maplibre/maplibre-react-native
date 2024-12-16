import { NativeModules, Platform } from "react-native";

import { offlineManager, OfflinePackDownloadState } from "../../../src";
import { OfflineModuleEventEmitter } from "../../../src/modules/offline/offlineManager";

describe("offlineManager", () => {
  const packOptions = {
    name: "test",
    styleURL: "https://demotiles.maplibre.org/style.json",
    bounds: [
      [0, 1],
      [2, 3],
    ],
    minZoom: 1,
    maxZoom: 22,
  };

  const mockOnProgressEvent = {
    type: "offlinestatus",
    payload: {
      name: packOptions.name,
      state: OfflinePackDownloadState.Active,
      progress: 50.0,
    },
  };

  const mockOnProgressCompleteEvent = {
    type: "offlinestatus",
    payload: {
      name: packOptions.name,
      state: OfflinePackDownloadState.Complete,
      progress: 100.0,
    },
  };

  const mockErrorEvent = {
    type: "offlineerror",
    payload: {
      name: packOptions.name,
      message: "unit test error",
    },
  };

  afterEach(async () => {
    const packs = await offlineManager.getPacks();
    for (const pack of packs) {
      await offlineManager.deletePack(pack.name);
    }

    jest.clearAllMocks();
  });

  it("should create pack", async () => {
    let offlinePack = await offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();

    await offlineManager.createPack(packOptions);
    offlinePack = await offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();
  });

  it("should delete pack", async () => {
    await offlineManager.createPack(packOptions);
    let offlinePack = await offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();

    await offlineManager.deletePack(packOptions.name);
    offlinePack = await offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();
  });

  it("should set max tile count limit", () => {
    const expectedLimit = 2000;
    const spy = jest.spyOn(
      NativeModules.MLRNOfflineModule,
      "setTileCountLimit",
    );
    offlineManager.setTileCountLimit(expectedLimit);
    expect(spy).toHaveBeenCalledWith(expectedLimit);
    spy.mockRestore();
  });

  it("should set progress event throttle value", () => {
    const expectedThrottleValue = 500;
    const spy = jest.spyOn(
      NativeModules.MLRNOfflineModule,
      "setProgressEventThrottle",
    );
    offlineManager.setProgressEventThrottle(expectedThrottleValue);
    expect(spy).toHaveBeenCalledWith(expectedThrottleValue);
    spy.mockRestore();
  });

  describe("Events", () => {
    it("should subscribe to native events", async () => {
      const spy = jest.spyOn(OfflineModuleEventEmitter, "addListener");
      const noop = () => {};
      await offlineManager.createPack(packOptions, noop, noop);
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockClear();
    });

    it("should call progress listener", async () => {
      const listener = jest.fn();
      await offlineManager.createPack(packOptions, listener);
      const expectedOfflinePack = await offlineManager.getPack(
        packOptions.name,
      );
      offlineManager._onProgress(mockOnProgressEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockOnProgressEvent.payload,
      );
    });

    it("should call error listener", async () => {
      const listener = jest.fn();
      await offlineManager.createPack(packOptions, null, listener);
      const expectedOfflinePack = await offlineManager.getPack(
        packOptions.name,
      );
      offlineManager._onError(mockErrorEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockErrorEvent.payload,
      );
    });

    it("should not call listeners after unsubscribe", async () => {
      const listener = jest.fn();
      await offlineManager.createPack(packOptions, listener, listener);
      offlineManager.unsubscribe(packOptions.name);
      offlineManager._onProgress(mockOnProgressEvent);
      offlineManager._onError(mockErrorEvent);
      expect(listener).not.toHaveBeenCalled();
    });

    it("should unsubscribe from native events", async () => {
      const noop = () => {};

      await offlineManager.createPack(packOptions, noop, noop);
      offlineManager.unsubscribe(packOptions.name);

      expect(offlineManager.subscriptionProgress.remove).toHaveBeenCalledTimes(
        1,
      );
      expect(offlineManager.subscriptionError.remove).toHaveBeenCalledTimes(1);
    });

    it("should unsubscribe event listeners once a pack download has completed", async () => {
      const listener = jest.fn();
      await offlineManager.createPack(packOptions, listener, listener);

      expect(
        offlineManager._hasListeners(
          packOptions.name,
          offlineManager._progressListeners,
        ),
      ).toBeTruthy();

      expect(
        offlineManager._hasListeners(
          packOptions.name,
          offlineManager._errorListeners,
        ),
      ).toBeTruthy();

      offlineManager._onProgress(mockOnProgressCompleteEvent);

      expect(
        offlineManager._hasListeners(
          packOptions.name,
          offlineManager._progressListeners,
        ),
      ).toBeFalsy();

      expect(
        offlineManager._hasListeners(
          packOptions.name,
          offlineManager._errorListeners,
        ),
      ).toBeFalsy();
    });
  });

  describe("Android", () => {
    beforeEach(() => (Platform.OS = "android"));

    it("should set pack observer manually", async () => {
      const spy = jest.spyOn(
        NativeModules.MLRNOfflineModule,
        "setPackObserver",
      );

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = { ...packOptions, name };
      await offlineManager.createPack(options);
      await offlineManager.subscribe(name, noop, noop);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should not set pack observer manually during create flow", async () => {
      const spy = jest.spyOn(
        NativeModules.MLRNOfflineModule,
        "setPackObserver",
      );

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = { ...packOptions, name };
      await offlineManager.createPack(options, noop, noop);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("iOS", () => {
    beforeEach(() => (Platform.OS = "ios"));

    it("should not set pack observer manually", async () => {
      const spy = jest.spyOn(
        NativeModules.MLRNOfflineModule,
        "setPackObserver",
      );

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = { ...packOptions, name };
      await offlineManager.createPack(options);
      await offlineManager.subscribe(name, noop, noop);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
