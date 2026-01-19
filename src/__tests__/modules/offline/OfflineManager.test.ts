import {
  type LngLatBounds,
  OfflineManager,
  type OfflinePackCreateOptions,
  type OfflinePackStatus,
} from "@maplibre/maplibre-react-native";

import {
  mockNativeModules,
  mockNativeModuleSubscription,
} from "../../__mocks__/NativeModules.mock";

describe("OfflineManager", () => {
  const mockPackId = "550e8400-e29b-41d4-a716-446655440000";

  const packOptions: OfflinePackCreateOptions = {
    mapStyle: "https://demotiles.maplibre.org/style.json",
    bounds: [0, 1, 2, 3] as LngLatBounds,
    minZoom: 1,
    maxZoom: 22,
    metadata: {
      name: "test",
    },
  };

  const mockOnProgressEvent: OfflinePackStatus = {
    id: mockPackId,
    state: "active",
    percentage: 50.0,
    completedResourceCount: 50,
    completedResourceSize: 1000,
    completedTileCount: 25,
    completedTileSize: 500,
    requiredResourceCount: 100,
  };

  const mockOnProgressCompleteEvent: OfflinePackStatus = {
    id: mockPackId,
    state: "complete",
    percentage: 100.0,
    completedResourceCount: 100,
    completedResourceSize: 2000,
    completedTileCount: 50,
    completedTileSize: 1000,
    requiredResourceCount: 100,
  };

  const mockErrorEvent = {
    id: mockPackId,
    message: "unit test error",
  };

  afterEach(async () => {
    const packs = await OfflineManager.getPacks();
    for (const pack of packs) {
      if (pack.id) {
        await OfflineManager.deletePack(pack.id);
      }
    }

    // Reset listener state using bracket notation
    OfflineManager["initialized"] = false;
    // @ts-ignore
    OfflineManager["offlinePacks"] = {};
    // @ts-ignore
    OfflineManager["progressListeners"] = {};
    // @ts-ignore
    OfflineManager["errorListeners"] = {};
    OfflineManager["subscriptionProgress"] = null;
    OfflineManager["subscriptionError"] = null;

    jest.clearAllMocks();
  });

  it("should create pack", async () => {
    const pack = await OfflineManager.createPack(
      packOptions,
      jest.fn(),
      jest.fn(),
    );
    expect(pack).toBeTruthy();
    expect(pack.id).toBeTruthy();
  });

  it("should get pack by id", async () => {
    const pack = await OfflineManager.createPack(
      packOptions,
      jest.fn(),
      jest.fn(),
    );
    const retrievedPack = await OfflineManager.getPack(pack.id);
    expect(retrievedPack).toBeTruthy();
    expect(retrievedPack?.id).toBe(pack.id);
  });

  it("should delete pack", async () => {
    const pack = await OfflineManager.createPack(
      packOptions,
      jest.fn(),
      jest.fn(),
    );
    expect(pack).toBeTruthy();

    await OfflineManager.deletePack(pack.id);
    const deletedPack = await OfflineManager.getPack(pack.id);
    expect(deletedPack).toBeFalsy();
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
      const pack = await OfflineManager.createPack(
        packOptions,
        listener,
        jest.fn(),
      );
      // Update event with actual pack id
      const progressEvent = { ...mockOnProgressEvent, id: pack.id };
      OfflineManager["onProgress"](progressEvent);
      expect(listener).toHaveBeenCalledWith(pack, progressEvent);
    });

    it("should call error listener", async () => {
      const listener = jest.fn();
      const pack = await OfflineManager.createPack(
        packOptions,
        jest.fn(),
        listener,
      );
      OfflineManager["onError"](mockErrorEvent);
      expect(listener).toHaveBeenCalledWith(pack, mockErrorEvent);
    });

    it("should not call listeners after unsubscribe", async () => {
      const listener = jest.fn();
      const pack = await OfflineManager.createPack(
        packOptions,
        listener,
        listener,
      );
      OfflineManager.unsubscribe(pack.id);
      const progressEvent = { ...mockOnProgressEvent, id: pack.id };
      OfflineManager["onProgress"](progressEvent);
      OfflineManager["onError"](mockErrorEvent);
      expect(listener).not.toHaveBeenCalled();
    });

    it("should unsubscribe from native events", async () => {
      const noop = jest.fn();

      const pack = await OfflineManager.createPack(packOptions, noop, noop);
      OfflineManager.unsubscribe(pack.id);

      expect(mockNativeModuleSubscription.remove).toHaveBeenCalledTimes(2);
    });

    it("should unsubscribe event listeners once a pack download has completed", async () => {
      const listener = jest.fn();
      const pack = await OfflineManager.createPack(
        packOptions,
        listener,
        listener,
      );

      const progressCompleteEvent = {
        ...mockOnProgressCompleteEvent,
        id: pack.id,
      };
      OfflineManager["onProgress"](progressCompleteEvent);

      // After complete event, listeners should be cleaned up
      expect(OfflineManager["progressListeners"][pack.id]).toBeUndefined();
      expect(OfflineManager["errorListeners"][pack.id]).toBeUndefined();
    });
  });

  describe("Pack Observer", () => {
    it("should set pack observer when subscribing to existing pack", async () => {
      const name = `test-${Date.now()}`;
      const noop = jest.fn();
      const options = { ...packOptions, name };
      const pack = await OfflineManager.createPack(
        options,
        jest.fn(),
        jest.fn(),
      );
      jest.clearAllMocks();

      await OfflineManager.subscribe(pack.id, noop, noop);

      expect(
        mockNativeModules.MLRNOfflineModule.setPackObserver,
      ).toHaveBeenCalledWith(pack.id);
    });

    it("should set pack observer during create flow when listeners provided", async () => {
      const name = `test-${Date.now()}`;
      const noop = jest.fn();
      const options = { ...packOptions, name };
      const pack = await OfflineManager.createPack(options, noop, noop);

      // setPackObserver should be called during createPack since pack is stored before subscribing
      expect(
        mockNativeModules.MLRNOfflineModule.setPackObserver,
      ).toHaveBeenCalledWith(pack.id);
    });
  });
});
