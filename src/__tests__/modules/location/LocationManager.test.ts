import {
  type GeolocationPosition,
  LocationManager,
} from "../../../modules/location/LocationManager";
import { mockTurboModules } from "../../__mocks__/NativeModules.mock";

const geolocationPosition: GeolocationPosition = {
  coords: {
    longitude: 4.1036916,
    latitude: 51.5462244,
    altitude: 44.64373779296875,
    accuracy: 9.977999687194824,
    heading: 251.5358428955078,
    speed: 0.08543474227190018,
  },
  timestamp: 1573730357879,
};

describe("LocationManager", () => {
  beforeEach(() => {
    LocationManager.removeAllListeners();
    LocationManager["currentPosition"] = undefined;

    jest.spyOn(console, "log").mockImplementation(jest.fn());
    jest.clearAllMocks();
  });

  describe("methods", () => {
    describe("getCurrentPosition", () => {
      test("returns from native module", async () => {
        jest
          .spyOn(mockTurboModules.MLRNLocationModule, "getCurrentPosition")
          .mockResolvedValue(geolocationPosition);

        const currentPosition = await LocationManager.getCurrentPosition();

        expect(currentPosition).toStrictEqual(geolocationPosition);
        expect(
          mockTurboModules.MLRNLocationModule.getCurrentPosition,
        ).toHaveBeenCalledTimes(1);
      });

      test("handles error", async () => {
        jest
          .spyOn(mockTurboModules.MLRNLocationModule, "getCurrentPosition")
          .mockRejectedValue(new Error());

        const currentPosition = await LocationManager.getCurrentPosition();

        expect(currentPosition).toBeUndefined();
        expect(LocationManager["currentPosition"]).toBeUndefined();
        expect(
          mockTurboModules.MLRNLocationModule.getCurrentPosition,
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
        expect(mockTurboModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    describe("start", () => {
      test("starts the native location manager", () => {
        LocationManager.start(10);

        expect(mockTurboModules.MLRNLocationModule.start).toHaveBeenCalledWith(
          10,
        );
        expect(LocationManager["isListening"]).toBe(true);
      });

      test("does not start if already listening", () => {
        LocationManager["isListening"] = true;
        LocationManager.start();

        expect(
          mockTurboModules.MLRNLocationModule.start,
        ).not.toHaveBeenCalled();
      });
    });

    describe("stop", () => {
      test("stops the native location manager", () => {
        expect(mockTurboModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          0,
        );

        LocationManager.start();
        LocationManager.stop();

        expect(mockTurboModules.MLRNLocationModule.stop).toHaveBeenCalledTimes(
          1,
        );
        expect(LocationManager["isListening"]).toBe(false);
      });
    });

    describe("setMinDisplacement", () => {
      test("calls native setMinDisplacement", () => {
        LocationManager.setMinDisplacement(5);

        expect(
          mockTurboModules.MLRNLocationModule.setMinDisplacement,
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
  });
});
