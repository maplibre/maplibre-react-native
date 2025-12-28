import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  /**
   * Adds a custom HTTP header that will be sent with all map tile requests.
   *
   * @param headerName - The name of the header
   * @param headerValue - The value of the header
   */
  addCustomHeader(headerName: string, headerValue: string): void;

  /**
   * Removes a previously added custom HTTP header.
   *
   * @param headerName - The name of the header to remove
   */
  removeCustomHeader(headerName: string): void;

  /**
   * Sets the connectivity state of the map. When set to false, the map will
   * not make any network requests and will only use cached tiles.
   *
   * @param connected - Whether the map should be connected to the network
   */
  setConnected(connected: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("MLRNRequestModule");
