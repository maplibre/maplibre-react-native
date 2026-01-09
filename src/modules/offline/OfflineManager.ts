import { type EventSubscription } from "react-native";

import NativeOfflineModule from "./NativeOfflineModule";
import {
  OfflineCreatePackOptions,
  type OfflineCreatePackInputOptions,
} from "./OfflineCreatePackOptions";
import { OfflinePack, type OfflinePackStatus } from "./OfflinePack";
import { isUndefined, isFunction } from "../../utils";

/**
 * Constants representing the offline pack download state.
 */
export const OfflinePackDownloadState = {
  Inactive: "inactive",
  Active: "active",
  Complete: "complete",
} as const;

/**
 * Represents the download state of an offline pack.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OfflinePackDownloadState =
  (typeof OfflinePackDownloadState)[keyof typeof OfflinePackDownloadState];

export type OfflinePackError = {
  name: string;
  message: string;
};

type ProgressListener = (pack: OfflinePack, status: OfflinePackStatus) => void;
type ErrorListener = (pack: OfflinePack, err: OfflinePackError) => void;

/**
 * OfflineManager implements a singleton (shared object) that manages offline packs.
 * All of this class's instance methods are asynchronous, reflecting the fact that offline resources are stored in a database.
 * The shared object maintains a canonical collection of offline packs.
 */
class OfflineManager {
  private hasInitialized: boolean;
  private offlinePacks: Record<string, OfflinePack>;
  private progressListeners: Record<string, ProgressListener>;
  private errorListeners: Record<string, ErrorListener>;
  private subscriptionProgress: EventSubscription | null;
  private subscriptionError: EventSubscription | null;

  constructor() {
    this.hasInitialized = false;
    this.offlinePacks = {};

    this.progressListeners = {};
    this.errorListeners = {};

    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);

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
    await this.initialize();

    const packOptions = new OfflineCreatePackOptions(options);

    if (this.offlinePacks[packOptions.name]) {
      throw new Error(
        `Offline pack with name ${packOptions.name} already exists.`,
      );
    }

    this.subscribe(packOptions.name, progressListener, errorListener);
    const nativeOfflinePack = await NativeOfflineModule.createPack(packOptions);
    this.offlinePacks[packOptions.name] = new OfflinePack(nativeOfflinePack);
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

    await this.initialize();

    const offlinePack = this.offlinePacks[name];
    if (offlinePack) {
      await NativeOfflineModule.invalidatePack(name);
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

    await this.initialize();

    const offlinePack = this.offlinePacks[name];
    if (offlinePack) {
      await NativeOfflineModule.deletePack(name);
      delete this.offlinePacks[name];
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
    await this.initialize();
    await NativeOfflineModule.invalidateAmbientCache();
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
    await this.initialize();
    await NativeOfflineModule.clearAmbientCache();
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
    await this.initialize();
    await NativeOfflineModule.setMaximumAmbientCacheSize(size);
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
    await this.initialize();
    await NativeOfflineModule.resetDatabase();
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
    await this.initialize();

    return Object.keys(this.offlinePacks)
      .map((name) => this.offlinePacks[name])
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
    await this.initialize();
    return this.offlinePacks[name];
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
    await this.initialize();
    return NativeOfflineModule.mergeOfflineRegions(path);
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
    NativeOfflineModule.setTileCountLimit(limit);
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
    NativeOfflineModule.setProgressEventThrottle(throttleValue);
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
    const totalProgressListeners = Object.keys(this.progressListeners).length;
    if (isFunction(progressListener)) {
      if (totalProgressListeners === 0) {
        this.subscriptionProgress = NativeOfflineModule.onProgress(
          this.onProgress,
        );
      }
      this.progressListeners[packName] = progressListener;
    }

    const totalErrorListeners = Object.keys(this.errorListeners).length;
    if (isFunction(errorListener)) {
      if (totalErrorListeners === 0) {
        this.subscriptionError = NativeOfflineModule.onError(this.onError);
      }
      this.errorListeners[packName] = errorListener;
    }

    // Set pack observer for resuming pack downloads
    if (this.offlinePacks[packName]) {
      try {
        await NativeOfflineModule.setPackObserver(packName);
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
    delete this.progressListeners[packName];
    delete this.errorListeners[packName];

    if (
      Object.keys(this.progressListeners).length === 0 &&
      this.subscriptionProgress
    ) {
      this.subscriptionProgress.remove();
    }

    if (
      Object.keys(this.errorListeners).length === 0 &&
      this.subscriptionError
    ) {
      this.subscriptionError.remove();
    }
  }

  private async initialize(): Promise<boolean> {
    if (this.hasInitialized) {
      return true;
    }

    const nativeOfflinePacks = await NativeOfflineModule.getPacks();

    for (const nativeOfflinePack of nativeOfflinePacks) {
      const offlinePack = new OfflinePack(nativeOfflinePack);
      if (offlinePack.name) {
        this.offlinePacks[offlinePack.name] = offlinePack;
      }
    }

    this.hasInitialized = true;
    return true;
  }

  private onProgress(e: OfflinePackStatus | { state: string }): void {
    const { name, state } = e as OfflinePackStatus;

    if (!this.hasListeners(name, this.progressListeners)) {
      return;
    }

    const pack = this.offlinePacks[name];
    if (pack) {
      this.progressListeners[name]?.(pack, e as OfflinePackStatus);
    }

    // cleanup listeners now that they are no longer needed
    if (state === OfflinePackDownloadState.Complete) {
      this.unsubscribe(name);
    }
  }

  private onError(e: OfflinePackError): void {
    const { name } = e;

    if (!this.hasListeners(name, this.errorListeners)) {
      return;
    }

    const pack = this.offlinePacks[name];
    if (pack) {
      this.errorListeners[name]?.(pack, e);
    }
  }

  private hasListeners(
    name: string,
    listenerMap:
      | Record<string, ProgressListener>
      | Record<string, ErrorListener>,
  ): boolean {
    return (
      !isUndefined(this.offlinePacks[name]) && isFunction(listenerMap[name])
    );
  }
}

const offlineManager = new OfflineManager();
export { offlineManager as OfflineManager };
