import {
  type GeolocationPosition,
  LocationManager,
} from "@maplibre/maplibre-react-native";
import { PermissionsAndroid, Platform } from "react-native";
import type {
  Permission,
  PermissionStatus,
} from "react-native/Libraries/PermissionsAndroid/PermissionsAndroid";

import { mockNativeModules } from "../../__mocks__/NativeModules.mock";

const geolocationPosition: GeolocationPosition = {
  coords: {
    longitude: 4.1036916,
    latitude: 51.5462244,
    accuracy: 9.977999687194824,
    altitude: 44.64373779296875,
    altitudeAccuracy: 4.543474227190018,
    heading: 251.5358428955078,
    speed: 0.08543474227190018,
  },
  timestamp: 1573730357879,
};

describe("LocationManager", () => {
  beforeEach(() => {
    LocationManager.removeAllListeners();
    LocationManager["currentPosition"] = undefined;

    jest.clearAllMocks();
  });

  describe("methods", () => {
    describe("getCurrentPosition", () => {
      test("returns from native module", async () => {
        jest
          .spyOn(mockNativeModules.MLRNLocationModule, "getCurrentPosition")
          .mockResolvedValue(geolocationPosition);

        const currentPosition = await LocationManager.getCurrentPosition();

        expect(currentPosition).toStrictEqual(geolocationPosition);
        expect(
          mockNativeModules.MLRNLocationModule.getCurrentPosition,
        ).toHaveBeenCalledTimes(1);
      });

      test("handles error", async () => {
        jest.spyOn(console, "log").mockImplementation(jest.fn());
        jest
          .spyOn(mockNativeModules.MLRNLocationModule, "getCurrentPosition")
          .mockRejectedValue(new Error());

        const currentPosition = await LocationManager.getCurrentPosition();

        expect(currentPosition).toBeUndefined();
        expect(LocationManager["currentPosition"]).toBeUndefined();
        expect(
          mockNativeModules.MLRNLocationModule.getCurrentPosition,
        ).toHaveBeenCalledTimes(1);
      });
    });

    const listenerA = jest.fn();
    const listenerB = jest.fn();

    describe("addListener", () => {
      test("adds the listener", () => {
        expect(LocationManager["listeners"]).toStrictEqual([]);
        LocationManager.addListener(listenerA);
        expect(LocationManager["listeners"]).toStrictEqual([listenerA]);
      });

      test("does not re-add the same listener", () => {
        LocationManager.addListener(listenerA);
        LocationManager.addListener(listenerA);
        expect(LocationManager["listeners"]).toStrictEqual([listenerA]);
      });

      test("calls listener with current position if available", () => {
        LocationManager["currentPosition"] = geolocationPosition;

        LocationManager.addListener(listenerA);

        expect(listenerA).toHaveBeenCalledWith(geolocationPosition);
      });
    });

    describe("removeListener", () => {
      beforeEach(() => {
        LocationManager.addListener(listenerA);
        LocationManager.addListener(listenerB);
      });

      test("removes the specified listener", () => {
        LocationManager.removeListener(listenerB);

        expect(LocationManager["listeners"]).toStrictEqual([listenerA]);
      });

      test("stops listening when all listeners are removed", () => {
        jest.spyOn(LocationManager, "stop");

        LocationManager.removeListener(listenerA);
        LocationManager.removeListener(listenerB);

        expect(LocationManager["listeners"]).toStrictEqual([]);
        expect(LocationManager.stop).toHaveBeenCalledTimes(1);
      });
    });

    describe("removeAllListeners", () => {
      test("removes all listeners and stops listening", () => {
        jest.spyOn(LocationManager, "stop");

        LocationManager.addListener(jest.fn());
        LocationManager.addListener(jest.fn());
        LocationManager.removeAllListeners();

        expect(LocationManager["listeners"]).toStrictEqual([]);
        expect(LocationManager.stop).toHaveBeenCalledTimes(1);
        expect(mockNativeModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    describe("start", () => {
      test("starts the native location manager", () => {
        LocationManager.start();

        expect(mockNativeModules.MLRNLocationModule.start).toHaveBeenCalled();
        expect(LocationManager["isListening"]).toBe(true);
      });

      test("does not start if already listening", () => {
        LocationManager["isListening"] = true;
        LocationManager.start();

        expect(
          mockNativeModules.MLRNLocationModule.start,
        ).not.toHaveBeenCalled();
      });
    });

    describe("stop", () => {
      test("stops the native location manager", () => {
        expect(mockNativeModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          0,
        );

        LocationManager.start();
        LocationManager.stop();

        expect(mockNativeModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          1,
        );
        expect(LocationManager["isListening"]).toBe(false);
      });
    });

    describe("setMinDisplacement", () => {
      test("calls native setMinDisplacement", () => {
        LocationManager.setMinDisplacement(5);

        expect(
          mockNativeModules.MLRNLocationModule.setMinDisplacement,
        ).toHaveBeenCalledWith(5);
      });
    });

    describe("handleUpdate", () => {
      test("updates current position and notifies listeners", () => {
        const listeners = [jest.fn(), jest.fn()];

        listeners.forEach((listener) => LocationManager.addListener(listener));
        LocationManager["handleUpdate"](geolocationPosition);

        expect(LocationManager["currentPosition"]).toStrictEqual(
          geolocationPosition,
        );
        listeners.forEach((listener) => {
          expect(listener).toHaveBeenCalledWith(geolocationPosition);
        });
      });
    });

    describe("requestPermissions", () => {
      describe("Android", () => {
        beforeEach(() => {
          Platform.OS = "android";
        });

        test("requests ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION", async () => {
          const requestMultipleSpy = jest
            .spyOn(PermissionsAndroid, "requestMultiple")
            .mockResolvedValue({
              [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
                PermissionsAndroid.RESULTS.GRANTED,
              [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
                PermissionsAndroid.RESULTS.GRANTED,
            } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(requestMultipleSpy).toHaveBeenCalledWith([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          expect(granted).toBe(true);
        });

        test("returns true when all permissions are granted", async () => {
          jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
              PermissionsAndroid.RESULTS.GRANTED,
            [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
              PermissionsAndroid.RESULTS.GRANTED,
          } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(true);
        });

        test("returns false when FINE_LOCATION is denied", async () => {
          jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
              PermissionsAndroid.RESULTS.DENIED,
            [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
              PermissionsAndroid.RESULTS.GRANTED,
          } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });

        test("returns false when COARSE_LOCATION is denied", async () => {
          jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
              PermissionsAndroid.RESULTS.GRANTED,
            [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
              PermissionsAndroid.RESULTS.DENIED,
          } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });

        test("returns false when all permissions are denied", async () => {
          jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
              PermissionsAndroid.RESULTS.DENIED,
            [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
              PermissionsAndroid.RESULTS.DENIED,
          } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });

        test("returns false when permissions are never ask again", async () => {
          jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]:
              PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
            [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]:
              PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
          } as { [key in Permission]: PermissionStatus });

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });
      });

      describe("iOS", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });

        test("calls native module requestPermissions", async () => {
          jest
            .spyOn(mockNativeModules.MLRNLocationModule, "requestPermissions")
            .mockResolvedValue(undefined);

          const granted = await LocationManager.requestPermissions();

          expect(
            mockNativeModules.MLRNLocationModule.requestPermissions,
          ).toHaveBeenCalledTimes(1);
          expect(granted).toBe(true);
        });

        test("returns true when permissions are granted", async () => {
          jest
            .spyOn(mockNativeModules.MLRNLocationModule, "requestPermissions")
            .mockResolvedValue(undefined);

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(true);
        });

        test("returns false when permissions are denied", async () => {
          jest
            .spyOn(mockNativeModules.MLRNLocationModule, "requestPermissions")
            .mockRejectedValue(
              new Error("PERMISSION_DENIED: Location permission was denied"),
            );

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });

        test("returns false when native module throws error", async () => {
          jest
            .spyOn(mockNativeModules.MLRNLocationModule, "requestPermissions")
            .mockRejectedValue(new Error("Unknown error"));

          const granted = await LocationManager.requestPermissions();

          expect(granted).toBe(false);
        });
      });
    });
  });
});
