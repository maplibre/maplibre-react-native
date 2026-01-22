import NativeNetworkModule from "./NativeNetworkModule";

/**
 * NetworkManager provides methods for managing HTTP requests made by MapLibre.
 * This includes adding custom headers to tile requests and controlling network connectivity.
 */
class NetworkManager {
  /**
   * Adds a custom HTTP header that will be sent with all map tile requests.
   * This is useful for adding authentication tokens or other custom headers
   * required by your tile server.
   *
   * @example
   * ```ts
   * NetworkManager.addRequestHeader("Authorization", "Bearer token123");
   * ```
   *
   * @param headerName The name of the header (e.g., "Authorization")
   * @param headerValue The value of the header (e.g., "Bearer token123")
   */
  static addRequestHeader(headerName: string, headerValue: string): void {
    NativeNetworkModule.addRequestHeader(headerName, headerValue);
  }

  /**
   * Removes a previously added custom HTTP header.
   *
   * @example
   * ```ts
   * NetworkManager.removeRequestHeader("Authorization");
   * ```
   *
   * @param headerName The name of the header to remove
   */
  static removeRequestHeader(headerName: string): void {
    NativeNetworkModule.removeRequestHeader(headerName);
  }

  /**
   * Android only: Sets the connectivity state of the map. When set to false, the map will
   * not make any network requests and will only use cached tiles. This is
   * useful for implementing offline mode or reducing data usage.
   *
   * @example
   * ```ts
   * // Enable offline mode
   * NetworkManager.setConnected(false);
   *
   * // Re-enable network requests
   * NetworkManager.setConnected(true);
   * ```
   *
   * @param connected Whether the map should be connected to the network
   */
  static setConnected(connected: boolean): void {
    NativeNetworkModule.setConnected(connected);
  }
}

export { NetworkManager };
