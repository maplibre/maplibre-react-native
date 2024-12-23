import { NativeModules, Platform } from "react-native";

import { OfflineManager, OfflinePackDownloadState } from "../../..";
import { OfflineModuleEventEmitter } from "../../../modules/offline/OfflineManager";

describe("OfflineManager", () => {
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
    const packs = await OfflineManager.getPacks();
    for (const pack of packs) {
      await OfflineManager.deletePack(pack.name);
    }

    jest.clearAllMocks();
  });

  it("should create pack", async () => {
    let offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();

    await OfflineManager.createPack(packOptions);
    offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();
  });

  it("should delete pack", async () => {
    await OfflineManager.createPack(packOptions);
    let offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();

    await OfflineManager.deletePack(packOptions.name);
    offlinePack = await OfflineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();
  });

  it("should set max tile count limit", () => {
    const expectedLimit = 2000;
    const spy = jest.spyOn(
      NativeModules.MLRNOfflineModule,
      "setTileCountLimit",
    );
    OfflineManager.setTileCountLimit(expectedLimit);
    expect(spy).toHaveBeenCalledWith(expectedLimit);
    spy.mockRestore();
  });

  it("should set progress event throttle value", () => {
    const expectedThrottleValue = 500;
    const spy = jest.spyOn(
      NativeModules.MLRNOfflineModule,
      "setProgressEventThrottle",
    );
    OfflineManager.setProgressEventThrottle(expectedThrottleValue);
    expect(spy).toHaveBeenCalledWith(expectedThrottleValue);
    spy.mockRestore();
  });

  describe("Events", () => {
    it("should subscribe to native events", async () => {
      const spy = jest.spyOn(OfflineModuleEventEmitter, "addListener");
      const noop = () => {};
      await OfflineManager.createPack(packOptions, noop, noop);
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockClear();
    });

    it("should call progress listener", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener);
      const expectedOfflinePack = await OfflineManager.getPack(
        packOptions.name,
      );
      OfflineManager._onProgress(mockOnProgressEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockOnProgressEvent.payload,
      );
    });

    it("should call error listener", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, null, listener);
      const expectedOfflinePack = await OfflineManager.getPack(
        packOptions.name,
      );
      OfflineManager._onError(mockErrorEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockErrorEvent.payload,
      );
    });

    it("should not call listeners after unsubscribe", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener, listener);
      OfflineManager.unsubscribe(packOptions.name);
      OfflineManager._onProgress(mockOnProgressEvent);
      OfflineManager._onError(mockErrorEvent);
      expect(listener).not.toHaveBeenCalled();
    });

    it("should unsubscribe from native events", async () => {
      const noop = () => {};

      await OfflineManager.createPack(packOptions, noop, noop);
      OfflineManager.unsubscribe(packOptions.name);

      expect(OfflineManager.subscriptionProgress.remove).toHaveBeenCalledTimes(
        1,
      );
      expect(OfflineManager.subscriptionError.remove).toHaveBeenCalledTimes(1);
    });

    it("should unsubscribe event listeners once a pack download has completed", async () => {
      const listener = jest.fn();
      await OfflineManager.createPack(packOptions, listener, listener);

      expect(
        OfflineManager._hasListeners(
          packOptions.name,
          OfflineManager._progressListeners,
        ),
      ).toBeTruthy();

      expect(
        OfflineManager._hasListeners(
          packOptions.name,
          OfflineManager._errorListeners,
        ),
      ).toBeTruthy();

      OfflineManager._onProgress(mockOnProgressCompleteEvent);

      expect(
        OfflineManager._hasListeners(
          packOptions.name,
          OfflineManager._progressListeners,
        ),
      ).toBeFalsy();

      expect(
        OfflineManager._hasListeners(
          packOptions.name,
          OfflineManager._errorListeners,
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
      await OfflineManager.createPack(options);
      await OfflineManager.subscribe(name, noop, noop);

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
      await OfflineManager.createPack(options, noop, noop);

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
      await OfflineManager.createPack(options);
      await OfflineManager.subscribe(name, noop, noop);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
