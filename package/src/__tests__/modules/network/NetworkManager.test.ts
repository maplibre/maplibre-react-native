import { NetworkManager } from "@maplibre/maplibre-react-native";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

describe("NetworkManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setConnected", () => {
    test("sets connected to true", () => {
      NetworkManager.setConnected(true);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("sets connected to false", () => {
      NetworkManager.setConnected(false);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledWith(false);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(1);
    });

    test("handles multiple state changes", () => {
      NetworkManager.setConnected(true);
      NetworkManager.setConnected(false);
      NetworkManager.setConnected(true);
      NetworkManager.setConnected(false);

      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenCalledTimes(4);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(1, true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(2, false);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(3, true);
      expect(
        mockNativeModules.MLRNNetworkModule.setConnected,
      ).toHaveBeenNthCalledWith(4, false);
    });
  });
});
