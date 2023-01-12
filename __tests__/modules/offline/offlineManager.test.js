import MapLibreGL from '../../../javascript';
import {OfflineModuleEventEmitter} from '../../../javascript/modules/offline/offlineManager';

import {NativeModules, Platform} from 'react-native';

describe('offlineManager', () => {
  const packOptions = {
    name: 'test',
    styleURL: 'mapbox://fake-style-url',
    bounds: [
      [0, 1],
      [2, 3],
    ],
    minZoom: 1,
    maxZoom: 22,
  };

  const mockOnProgressEvent = {
    type: 'offlinestatus',
    payload: {
      name: packOptions.name,
      state: MapLibreGL.OfflinePackDownloadState.Active,
      progress: 50.0,
    },
  };

  const mockOnProgressCompleteEvent = {
    type: 'offlinestatus',
    payload: {
      name: packOptions.name,
      state: MapLibreGL.OfflinePackDownloadState.Complete,
      progress: 100.0,
    },
  };

  const mockErrorEvent = {
    type: 'offlineerror',
    payload: {
      name: packOptions.name,
      message: 'unit test error',
    },
  };

  afterEach(async () => {
    const packs = await MapLibreGL.offlineManager.getPacks();
    for (const pack of packs) {
      await MapLibreGL.offlineManager.deletePack(pack.name);
    }

    jest.clearAllMocks();
  });

  it('should create pack', async () => {
    let offlinePack = await MapLibreGL.offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();

    await MapLibreGL.offlineManager.createPack(packOptions);
    offlinePack = await MapLibreGL.offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();
  });

  it('should delete pack', async () => {
    await MapLibreGL.offlineManager.createPack(packOptions);
    let offlinePack = await MapLibreGL.offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeTruthy();

    await MapLibreGL.offlineManager.deletePack(packOptions.name);
    offlinePack = await MapLibreGL.offlineManager.getPack(packOptions.name);
    expect(offlinePack).toBeFalsy();
  });

  it('should set max tile count limit', () => {
    const expectedLimit = 2000;
    const spy = jest.spyOn(NativeModules.MGLOfflineModule, 'setTileCountLimit');
    MapLibreGL.offlineManager.setTileCountLimit(expectedLimit);
    expect(spy).toHaveBeenCalledWith(expectedLimit);
    spy.mockRestore();
  });

  it('should set progress event throttle value', () => {
    const expectedThrottleValue = 500;
    const spy = jest.spyOn(
      NativeModules.MGLOfflineModule,
      'setProgressEventThrottle',
    );
    MapLibreGL.offlineManager.setProgressEventThrottle(expectedThrottleValue);
    expect(spy).toHaveBeenCalledWith(expectedThrottleValue);
    spy.mockRestore();
  });

  describe('Events', () => {
    it('should subscribe to native events', async () => {
      const spy = jest.spyOn(OfflineModuleEventEmitter, 'addListener');
      const noop = () => {};
      await MapLibreGL.offlineManager.createPack(packOptions, noop, noop);
      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockClear();
    });

    it('should call progress listener', async () => {
      const listener = jest.fn();
      await MapLibreGL.offlineManager.createPack(packOptions, listener);
      const expectedOfflinePack = await MapLibreGL.offlineManager.getPack(
        packOptions.name,
      );
      MapLibreGL.offlineManager._onProgress(mockOnProgressEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockOnProgressEvent.payload,
      );
    });

    it('should call error listener', async () => {
      const listener = jest.fn();
      await MapLibreGL.offlineManager.createPack(packOptions, null, listener);
      const expectedOfflinePack = await MapLibreGL.offlineManager.getPack(
        packOptions.name,
      );
      MapLibreGL.offlineManager._onError(mockErrorEvent);
      expect(listener).toHaveBeenCalledWith(
        expectedOfflinePack,
        mockErrorEvent.payload,
      );
    });

    it('should not call listeners after unsubscribe', async () => {
      const listener = jest.fn();
      await MapLibreGL.offlineManager.createPack(
        packOptions,
        listener,
        listener,
      );
      MapLibreGL.offlineManager.unsubscribe(packOptions.name);
      MapLibreGL.offlineManager._onProgress(mockOnProgressEvent);
      MapLibreGL.offlineManager._onError(mockErrorEvent);
      expect(listener).not.toHaveBeenCalled();
    });

    it('should unsubscribe from native events', async () => {
      const noop = () => {};

      await MapLibreGL.offlineManager.createPack(packOptions, noop, noop);
      MapLibreGL.offlineManager.unsubscribe(packOptions.name);

      expect(
        MapLibreGL.offlineManager.subscriptionProgress.remove,
      ).toHaveBeenCalledTimes(1);
      expect(
        MapLibreGL.offlineManager.subscriptionError.remove,
      ).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe event listeners once a pack download has completed', async () => {
      const listener = jest.fn();
      await MapLibreGL.offlineManager.createPack(
        packOptions,
        listener,
        listener,
      );

      expect(
        MapLibreGL.offlineManager._hasListeners(
          packOptions.name,
          MapLibreGL.offlineManager._progressListeners,
        ),
      ).toBeTruthy();

      expect(
        MapLibreGL.offlineManager._hasListeners(
          packOptions.name,
          MapLibreGL.offlineManager._errorListeners,
        ),
      ).toBeTruthy();

      MapLibreGL.offlineManager._onProgress(mockOnProgressCompleteEvent);

      expect(
        MapLibreGL.offlineManager._hasListeners(
          packOptions.name,
          MapLibreGL.offlineManager._progressListeners,
        ),
      ).toBeFalsy();

      expect(
        MapLibreGL.offlineManager._hasListeners(
          packOptions.name,
          MapLibreGL.offlineManager._errorListeners,
        ),
      ).toBeFalsy();
    });
  });

  describe('Android', () => {
    beforeEach(() => (Platform.OS = 'android'));

    it('should set pack observer manually', async () => {
      const spy = jest.spyOn(NativeModules.MGLOfflineModule, 'setPackObserver');

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = {...packOptions, name};
      await MapLibreGL.offlineManager.createPack(options);
      await MapLibreGL.offlineManager.subscribe(name, noop, noop);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not set pack observer manually during create flow', async () => {
      const spy = jest.spyOn(NativeModules.MGLOfflineModule, 'setPackObserver');

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = {...packOptions, name};
      await MapLibreGL.offlineManager.createPack(options, noop, noop);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('iOS', () => {
    beforeEach(() => (Platform.OS = 'ios'));

    it('should not set pack observer manually', async () => {
      const spy = jest.spyOn(NativeModules.MGLOfflineModule, 'setPackObserver');

      const name = `test-${Date.now()}`;
      const noop = () => {};
      const options = {...packOptions, name};
      await MapLibreGL.offlineManager.createPack(options);
      await MapLibreGL.offlineManager.subscribe(name, noop, noop);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
