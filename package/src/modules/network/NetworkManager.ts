import NativeNetworkModule from "./NativeNetworkModule";

/**
 * NetworkManager provides methods for managing and controlling network
 * connectivity.
 */
class NetworkManager {
  /**
   * Android only: Sets the connectivity state of the map. When set to false, the
   * map will not make any network requests and will only use cached tiles. This
   * is useful for implementing offline mode or reducing data usage.
   *
   * @param connected - Whether the map should be connected to the network
   *
   * @example
   * ```ts
   * // Enable offline mode
   * NetworkManager.setConnected(false);
   * // Re-enable network requests
   * NetworkManager.setConnected(true);
   * ```
   */
  static setConnected(connected: boolean): void {
    NativeNetworkModule.setConnected(connected);
  }
}

export { NetworkManager };
