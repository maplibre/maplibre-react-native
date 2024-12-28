import {
  NativeModules,
  NativeEventEmitter,
  type EventSubscription,
} from "react-native";

import {
  OfflineCreatePackOptions,
  type OfflineCreatePackInputOptions,
} from "./OfflineCreatePackOptions";
import { OfflinePack, type OfflinePackStatus } from "./OfflinePack";
import { isUndefined, isFunction, isAndroid } from "../../utils";

const MLRNModule = NativeModules.MLRNModule;
const MLRNOfflineModule = NativeModules.MLRNOfflineModule;
export const OfflineModuleEventEmitter = new NativeEventEmitter(
  MLRNOfflineModule,
);

export type OfflinePackError = {
  name: string;
  message: string;
};

type ErrorEvent = {
  payload: OfflinePackError;
};

type ProgressEvent = {
  payload: OfflinePackStatus;
};

type ProgressListener = (pack: OfflinePack, status: OfflinePackStatus) => void;
type ErrorListener = (pack: OfflinePack, err: OfflinePackError) => void;

/**
 * OfflineManager implements a singleton (shared object) that manages offline packs.
 * All of this class’s instance methods are asynchronous, reflecting the fact that offline resources are stored in a database.
 * The shared object maintains a canonical collection of offline packs.
 */
class OfflineManager {
  _hasInitialized: boolean;
  _offlinePacks: Record<string, OfflinePack>;
  _progressListeners: Record<string, ProgressListener>;
  _errorListeners: Record<string, ErrorListener>;
  subscriptionProgress: EventSubscription | null;
  subscriptionError: EventSubscription | null;

  constructor() {
    this._hasInitialized = false;
    this._offlinePacks = {};

    this._progressListeners = {};
    this._errorListeners = {};

    this._onProgress = this._onProgress.bind(this);
    this._onError = this._onError.bind(this);

    this.subscriptionProgress = null;
    this.subscriptionError = null;
  }

  /**
   * Creates and registers an offline pack that downloads the resources needed to use the given region offline.
   *
   * @example
   *
   * const progressListener = (offlineRegion, status) => console.log(offlineRegion, status);
   * const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);
   *
   * await OfflineManager.createPack({
   *   name: 'offlinePack',
   *   styleURL: 'https://demotiles.maplibre.org/tiles/tiles.json',
   *   minZoom: 14,
   *   maxZoom: 20,
   *   bounds: [[neLng, neLat], [swLng, swLat]]
   * }, progressListener, errorListener)
   *
   * @param  {OfflineCreatePackOptions} options Create options for a offline pack that specifices zoom levels, style url, and the region to download.
   * @param  {ProgressListener} progressListener Callback that listens for status events while downloading the offline resource.
   * @param  {ErrorListener} errorListener Callback that listens for status events while downloading the offline resource.
   * @return {void}
   */
  async createPack(
    options: OfflineCreatePackInputOptions,
    progressListener: ProgressListener,
    errorListener: ErrorListener,
  ): Promise<void> {
    await this._initialize();

    const packOptions = new OfflineCreatePackOptions(options);

    if (this._offlinePacks[packOptions.name]) {
      throw new Error(
        `Offline pack with name ${packOptions.name} already exists.`,
      );
    }

    this.subscribe(packOptions.name, progressListener, errorListener);
    const nativeOfflinePack = await MLRNOfflineModule.createPack(packOptions);
    this._offlinePacks[packOptions.name] = new OfflinePack(nativeOfflinePack);
  }

  /**
   * Invalidates the specified offline pack. This method checks that the tiles in the specified offline pack match those from the server. Local tiles that do not match the latest version on the server are updated.
   *
   * This is more efficient than deleting the offline pack and downloading it again. If the data stored locally matches that on the server, new data will not be downloaded.
   *
   * @example
   * await OfflineManager.invalidatePack('packName')
   *
   * @param  {string}  name  Name of the offline pack.
   * @return {void}
   */
  async invalidatePack(name: string): Promise<void> {
    if (!name) {
      return;
    }

    await this._initialize();

    const offlinePack = this._offlinePacks[name];
    if (offlinePack) {
      await MLRNOfflineModule.invalidatePack(name);
    }
  }

  /**
   * Unregisters the given offline pack and allows resources that are no longer required by any remaining packs to be potentially freed.
   *
   * @example
   * await OfflineManager.deletePack('packName')
   *
   * @param  {string}  name  Name of the offline pack.
   * @return {void}
   */
  async deletePack(name: string): Promise<void> {
    if (!name) {
      return;
    }

    await this._initialize();

    const offlinePack = this._offlinePacks[name];
    if (offlinePack) {
      await MLRNOfflineModule.deletePack(name);
      delete this._offlinePacks[name];
    }
  }

  /**
   * Forces a revalidation of the tiles in the ambient cache and downloads a fresh version of the tiles from the tile server.
   * This is the recommend method for clearing the cache.
   * This is the most efficient method because tiles in the ambient cache are re-downloaded to remove outdated data from a device.
   * It does not erase resources from the ambient cache or delete the database, which can be computationally expensive operations that may carry unintended side effects.
   *
   * @example
   * await OfflineManager.invalidateAmbientCache();
   *
   * @return {void}
   */
  async invalidateAmbientCache(): Promise<void> {
    await this._initialize();
    await MLRNOfflineModule.invalidateAmbientCache();
  }

  /**
   * Erases resources from the ambient cache.
   * This method clears the cache and decreases the amount of space that map resources take up on the device.
   *
   * @example
   * await OfflineManager.clearAmbientCache();
   *
   * @return {void}
   */
  async clearAmbientCache(): Promise<void> {
    await this._initialize();
    await MLRNOfflineModule.clearAmbientCache();
  }

  /**
   * Sets the maximum size of the ambient cache in bytes. Disables the ambient cache if set to 0.
   * This method may be computationally expensive because it will erase resources from the ambient cache if its size is decreased.
   *
   * @example
   * await OfflineManager.setMaximumAmbientCacheSize(5000000);
   *
   * @param  {number}  size  Size of ambient cache.
   * @return {void}
   */
  async setMaximumAmbientCacheSize(size: number): Promise<void> {
    await this._initialize();
    await MLRNOfflineModule.setMaximumAmbientCacheSize(size);
  }

  /**
   * Deletes the existing database, which includes both the ambient cache and offline packs, then reinitializes it.
   *
   * @example
   * await OfflineManager.resetDatabase();
   *
   * @return {void}
   */
  async resetDatabase(): Promise<void> {
    await this._initialize();
    await MLRNOfflineModule.resetDatabase();
  }

  /**
   * Retrieves all the current offline packs that are stored in the database.
   *
   * @example
   * const offlinePacks = await OfflineManager.getPacks();
   *
   * @return {Array<OfflinePack>}
   */
  async getPacks(): Promise<OfflinePack[]> {
    await this._initialize();

    return Object.keys(this._offlinePacks)
      .map((name) => this._offlinePacks[name])
      .filter((pack) => !!pack);
  }

  /**
   * Retrieves an offline pack that is stored in the database by name.
   *
   * @example
   * const offlinePack = await OfflineManager.getPack();
   *
   * @param  {string}  name  Name of the offline pack.
   * @return {OfflinePack}
   */
  async getPack(name: string) {
    await this._initialize();
    return this._offlinePacks[name];
  }

  /**
   * Sideloads offline db
   *
   * @example
   * await OfflineManager.mergeOfflineRegions(path);
   *
   * @param {string} path Path to offline tile db on file system.
   * @return {void}
   */
  async mergeOfflineRegions(path: string): Promise<void> {
    await this._initialize();
    return MLRNOfflineModule.mergeOfflineRegions(path);
  }

  /**
   * Sets the maximum number of tiles that may be downloaded and stored on the current device.
   * Consult the Terms of Service for your map tile host before changing this value.
   *
   * @example
   * OfflineManager.setTileCountLimit(1000);
   *
   * @param {number} limit Map tile limit count.
   * @return {void}
   */
  setTileCountLimit(limit: number): void {
    MLRNOfflineModule.setTileCountLimit(limit);
  }

  /**
   * Sets the period at which download status events will be sent over the React Native bridge.
   * The default is 500ms.
   *
   * @example
   * OfflineManager.setProgressEventThrottle(500);
   *
   * @param {number} throttleValue event throttle value in ms.
   * @return {void}
   */
  setProgressEventThrottle(throttleValue: number): void {
    MLRNOfflineModule.setProgressEventThrottle(throttleValue);
  }

  /**
   * Subscribe to download status/error events for the requested offline pack.
   * Note that createPack calls this internally if listeners are provided.
   *
   * @example
   * const progressListener = (offlinePack, status) => console.log(offlinePack, status)
   * const errorListener = (offlinePack, err) => console.log(offlinePack, err)
   * OfflineManager.subscribe('packName', progressListener, errorListener)
   *
   * @param  {string} packName           Name of the offline pack.
   * @param  {ProgressListener} progressListener Callback that listens for status events while downloading the offline resource.
   * @param  {ErrorListener} errorListener      Callback that listens for status events while downloading the offline resource.
   * @return {void}
   */
  async subscribe(
    packName: string,
    progressListener: ProgressListener,
    errorListener: ErrorListener,
  ): Promise<void> {
    const totalProgressListeners = Object.keys(this._progressListeners).length;
    if (isFunction(progressListener)) {
      if (totalProgressListeners === 0) {
        this.subscriptionProgress = OfflineModuleEventEmitter.addListener(
          MLRNModule.OfflineCallbackName.Progress,
          this._onProgress,
        );
      }
      this._progressListeners[packName] = progressListener;
    }

    const totalErrorListeners = Object.keys(this._errorListeners).length;
    if (isFunction(errorListener)) {
      if (totalErrorListeners === 0) {
        this.subscriptionError = OfflineModuleEventEmitter.addListener(
          MLRNModule.OfflineCallbackName.Error,
          this._onError,
        );
      }
      this._errorListeners[packName] = errorListener;
    }

    // we need to manually set the pack observer on Android
    // if we're resuming a pack download instead of going thru the create flow
    if (isAndroid() && this._offlinePacks[packName]) {
      try {
        // manually set a listener, since listeners are only set on create flow
        await MLRNOfflineModule.setPackObserver(packName);
      } catch (e) {
        console.log("Unable to set pack observer", e);
      }
    }
  }

  /**
   * Unsubscribes any listeners associated with the offline pack.
   * It's a good idea to call this on componentWillUnmount.
   *
   * @example
   * OfflineManager.unsubscribe('packName')
   *
   * @param  {string} packName Name of the offline pack.
   * @return {void}
   */
  unsubscribe(packName: string): void {
    delete this._progressListeners[packName];
    delete this._errorListeners[packName];

    if (
      Object.keys(this._progressListeners).length === 0 &&
      this.subscriptionProgress
    ) {
      this.subscriptionProgress.remove();
    }

    if (
      Object.keys(this._errorListeners).length === 0 &&
      this.subscriptionError
    ) {
      this.subscriptionError.remove();
    }
  }

  async _initialize(): Promise<boolean> {
    if (this._hasInitialized) {
      return true;
    }

    const nativeOfflinePacks = await MLRNOfflineModule.getPacks();

    for (const nativeOfflinePack of nativeOfflinePacks) {
      const offlinePack = new OfflinePack(nativeOfflinePack);
      if (offlinePack.name) {
        this._offlinePacks[offlinePack.name] = offlinePack;
      }
    }

    this._hasInitialized = true;
    return true;
  }

  _onProgress(e: ProgressEvent): void {
    const { name, state } = e.payload;

    if (!this._hasListeners(name, this._progressListeners)) {
      return;
    }

    const pack = this._offlinePacks[name];
    if (pack) {
      this._progressListeners[name]?.(pack, e.payload);
    }

    // cleanup listeners now that they are no longer needed
    if (state === MLRNModule.OfflinePackDownloadState.Complete) {
      this.unsubscribe(name);
    }
  }

  _onError(e: ErrorEvent): void {
    const { name } = e.payload;

    if (!this._hasListeners(name, this._errorListeners)) {
      return;
    }

    const pack = this._offlinePacks[name];
    if (pack) {
      this._errorListeners[name]?.(pack, e.payload);
    }
  }

  _hasListeners(
    name: string,
    listenerMap:
      | Record<string, ProgressListener>
      | Record<string, ErrorListener>,
  ): boolean {
    return (
      !isUndefined(this._offlinePacks[name]) && isFunction(listenerMap[name])
    );
  }
}

const offlineManager = new OfflineManager();
export { offlineManager as OfflineManager };
