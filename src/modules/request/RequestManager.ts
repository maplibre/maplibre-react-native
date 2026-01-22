import NativeRequestModule from "./NativeRequestModule";

/**
 * RequestManager provides methods for managing HTTP requests made by MapLibre.
 * This includes adding custom headers to tile requests and controlling network connectivity.
 */
class RequestManager {
  /**
   * Adds a custom HTTP header that will be sent with all map tile requests.
   * This is useful for adding authentication tokens or other custom headers
   * required by your tile server.
   *
   * @example
   * ```ts
   * RequestManager.addHeader("Authorization", "Bearer token123");
   * ```
   *
   * @param headerName The name of the header (e.g., "Authorization")
   * @param headerValue The value of the header (e.g., "Bearer token123")
   */
  static addHeader(headerName: string, headerValue: string): void {
    NativeRequestModule.addHeader(headerName, headerValue);
  }

  /**
   * Removes a previously added custom HTTP header.
   *
   * @example
   * ```ts
   * RequestManager.removeHeader("Authorization");
   * ```
   *
   * @param headerName The name of the header to remove
   */
  static removeHeader(headerName: string): void {
    NativeRequestModule.removeHeader(headerName);
  }

  /**
   * Android only: Sets the connectivity state of the map. When set to false, the map will
   * not make any network requests and will only use cached tiles. This is
   * useful for implementing offline mode or reducing data usage.
   *
   * @example
   * ```ts
   * // Enable offline mode
   * RequestManager.setConnected(false);
   *
   * // Re-enable network requests
   * RequestManager.setConnected(true);
   * ```
   *
   * @param connected Whether the map should be connected to the network
   */
  static setConnected(connected: boolean): void {
    NativeRequestModule.setConnected(connected);
  }
}

export { RequestManager };
