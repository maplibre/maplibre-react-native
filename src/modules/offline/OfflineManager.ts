import { type EventSubscription } from "react-native";

import NativeOfflineModule from "./NativeOfflineModule";
import { OfflinePack, type OfflinePackStatus } from "./OfflinePack";
import type { LngLatBounds } from "../../types/LngLatBounds";

export interface OfflinePackCreateOptions {
  mapStyle: string;
  bounds: LngLatBounds;
  minZoom?: number;
  maxZoom?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Represents the offline pack download state
 */
export type OfflinePackDownloadState = "inactive" | "active" | "complete";

export type OfflinePackError = {
  id: string;
  message: string;
};

export type OfflinePackProgressListener = (
  offlinePack: OfflinePack,
  status: OfflinePackStatus,
) => void;
export type OfflinePackErrorListener = (
  offlinePack: OfflinePack,
  error: OfflinePackError,
) => void;

/**
 * OfflineManager implements a singleton (shared object) that manages offline packs.
 * All of this class's instance methods are asynchronous, reflecting the fact that offline resources are stored in a database.
 * The shared object maintains a canonical collection of offline packs.
 */
class OfflineManager {
  private initialized: boolean;

  private readonly offlinePacks: Record<string, OfflinePack>;

  private readonly progressListeners: Record<
    string,
    OfflinePackProgressListener
  >;
  private readonly errorListeners: Record<string, OfflinePackErrorListener>;

  private subscriptionProgress: EventSubscription | null;
  private subscriptionError: EventSubscription | null;

  constructor() {
    this.initialized = false;

    this.offlinePacks = {};

    this.progressListeners = {};
    this.errorListeners = {};

    this.handleProgress = this.handleProgress.bind(this);
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
   * const offlinePack = await OfflineManager.createPack({
   *   name: 'offlinePack',
   *   styleURL: 'https://demotiles.maplibre.org/tiles/tiles.json',
   *   minZoom: 14,
   *   maxZoom: 20,
   *   bounds: [[neLng, neLat], [swLng, swLat]]
   * }, progressListener, errorListener)
   *
   * @param options Create options for offline pack that specifies zoom levels, style url, and the region to download.
   * @param  progressListener Callback that listens for status events while downloading the offline resource.
   * @param  errorListener Callback that listens for status events while downloading the offline resource.
   *
   * @return The created offline pack with its generated ID.
   */
  async createPack(
    options: OfflinePackCreateOptions,
    progressListener: OfflinePackProgressListener,
    errorListener: OfflinePackErrorListener,
  ): Promise<OfflinePack> {
    await this.initialize();

    const offlinePackOptions = {
      mapStyle: options.mapStyle,
      bounds: options.bounds,
      minZoom: options.minZoom ?? 10,
      maxZoom: options.maxZoom ?? 20,
      metadata: JSON.stringify(options.metadata ?? {}),
    };

    const nativeOfflinePack =
      await NativeOfflineModule.createPack(offlinePackOptions);
    const offlinePack = new OfflinePack(nativeOfflinePack);

    this.offlinePacks[offlinePack.id] = offlinePack;
    await this.addListener(offlinePack.id, progressListener, errorListener);

    return offlinePack;
  }

  /**
   * Invalidates the specified offline pack. This method checks that the tiles in the specified offline pack match those from the server. Local tiles that do not match the latest version on the server are updated.
   *
   * This is more efficient than deleting the offline pack and downloading it again. If the data stored locally matches that on the server, new data will not be downloaded.
   *
   * @example
   * await OfflineManager.invalidatePack(pack.id)
   *
   * @param  {string}  id  ID of the offline pack.
   * @return {void}
   */
  async invalidatePack(id: string): Promise<void> {
    await this.initialize();

    const offlinePack = this.offlinePacks[id];
    if (offlinePack) {
      await NativeOfflineModule.invalidatePack(id);
    }
  }

  /**
   * Unregisters the given offline pack and allows resources that are no longer required by any remaining packs to be potentially freed.
   *
   * @example
   * await OfflineManager.deletePack(pack.id)
   *
   * @param  {string}  id  ID of the offline pack.
   * @return {void}
   */
  async deletePack(id: string): Promise<void> {
    await this.initialize();

    const offlinePack = this.offlinePacks[id];
    if (offlinePack) {
      await NativeOfflineModule.deletePack(id);
      delete this.offlinePacks[id];
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

    return Object.values(this.offlinePacks);
  }

  /**
   * Retrieves an offline pack that is stored in the database by ID.
   *
   * @example
   * const offlinePack = await OfflineManager.getPack(packId);
   *
   * @param  {string}  id  ID of the offline pack.
   * @return {OfflinePack | undefined}
   */
  async getPack(id: string): Promise<OfflinePack | undefined> {
    await this.initialize();
    return this.offlinePacks[id];
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
   * OfflineManager.subscribe(pack.id, progressListener, errorListener)
   *
   * @param  id           ID of the offline pack.
   * @param  progressListener Callback that listens for status events while downloading the offline resource.
   * @param  errorListener      Callback that listens for status events while downloading the offline resource.
   */
  async addListener(
    id: string,
    progressListener: OfflinePackProgressListener,
    errorListener: OfflinePackErrorListener,
  ): Promise<void> {
    const totalProgressListeners = Object.keys(this.progressListeners).length;
    if (totalProgressListeners === 0) {
      this.subscriptionProgress = NativeOfflineModule.onProgress(
        this.handleProgress,
      );
    }
    this.progressListeners[id] = progressListener;

    const totalErrorListeners = Object.keys(this.errorListeners).length;
    if (totalErrorListeners === 0) {
      this.subscriptionError = NativeOfflineModule.onError(this.onError);
    }
    this.errorListeners[id] = errorListener;

    // Set pack observer for resuming pack downloads
    if (this.offlinePacks[id]) {
      try {
        await NativeOfflineModule.setPackObserver(id);
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
   * OfflineManager.unsubscribe(pack.id)
   *
   * @param  {string} packId ID of the offline pack.
   * @return {void}
   */
  removeListener(packId: string): void {
    delete this.progressListeners[packId];
    delete this.errorListeners[packId];

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
    if (this.initialized) {
      return true;
    }

    const nativeOfflinePacks = await NativeOfflineModule.getPacks();

    for (const nativeOfflinePack of nativeOfflinePacks) {
      const offlinePack = new OfflinePack(nativeOfflinePack);
      if (offlinePack.id) {
        this.offlinePacks[offlinePack.id] = offlinePack;
      }
    }

    this.initialized = true;
    return true;
  }

  private handleProgress(event: OfflinePackStatus) {
    const { id, state } = event;
    const offlinePack = this.offlinePacks[id];

    if (offlinePack) {
      this.progressListeners[offlinePack.id]?.(offlinePack, event);
    }

    if (state === "complete") {
      this.removeListener(id);
    }
  }

  private onError(event: OfflinePackError) {
    const { id } = event;

    const offlinePack = this.offlinePacks[id];
    if (!offlinePack) {
      return;
    }

    this.errorListeners[offlinePack.id]?.(offlinePack, event);
  }
}

const offlineManager = new OfflineManager();
export { offlineManager as OfflineManager };
