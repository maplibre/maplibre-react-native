import { NativeModules } from "react-native";

import {
  LocationManager,
  LocationModuleEventEmitter,
} from "../../../modules/location/LocationManager";

const MLRNModule = NativeModules.MLRNModule;
const MLRNLocationModule = NativeModules.MLRNLocationModule;

const location = {
  coords: {
    accuracy: 9.977999687194824,
    altitude: 44.64373779296875,
    heading: 251.5358428955078,
    latitude: 51.5462244,
    longitude: 4.1036916,
    speed: 0.08543474227190018,
  },
  timestamp: 1573730357879,
};

describe("LocationManager", () => {
  describe("constructor", () => {
    test("initializes LocationManager correctly", () => {
      expect(LocationManager._listeners).toStrictEqual([]);
      expect(LocationManager._lastKnownLocation).toStrictEqual(null);
      expect(LocationManager._isListening).toStrictEqual(false);
    });
  });

  describe("methods", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("#getLastKnownLocation", () => {
      test("gets last known location from native LocationManager if non available", async () => {
        jest
          .spyOn(MLRNLocationModule, "getLastKnownLocation")
          .mockImplementation(() => location);

        const lastKnownLocation = await LocationManager.getLastKnownLocation();

        expect(lastKnownLocation).toStrictEqual(location);
        expect(LocationManager._lastKnownLocation).toStrictEqual(location);
        expect(MLRNLocationModule.getLastKnownLocation).toHaveBeenCalledTimes(
          1,
        );

        LocationManager._lastKnownLocation = null;
      });

      test("returns cached location if available", async () => {
        LocationManager._lastKnownLocation = location;

        await LocationManager.getLastKnownLocation();

        expect(LocationManager._lastKnownLocation).toStrictEqual(location);

        expect(MLRNLocationModule.getLastKnownLocation).not.toHaveBeenCalled();

        // reset
        LocationManager._lastKnownLocation = null;
      });
    });

    describe("#addListener", () => {
      const myListener = jest.fn();
      MLRNModule.LocationCallbackName = { Update: "MapboxUserLocationUpdate" };

      afterEach(() => {
        LocationManager._listeners = [];
      });

      test("adds the listener", () => {
        expect(LocationManager._listeners).toStrictEqual([]);
        LocationManager.addListener(myListener);
        expect(LocationManager._listeners).toStrictEqual([myListener]);
      });

      test("does not re-add same listener", () => {
        LocationManager.addListener(myListener);
        expect(LocationManager._listeners).toStrictEqual([myListener]);
        LocationManager.addListener(myListener);
        expect(LocationManager._listeners).toStrictEqual([myListener]);
        expect(myListener).not.toHaveBeenCalled();
      });

      test('calls listener with "lastKnownLocation"', () => {
        LocationManager._lastKnownLocation = location;

        LocationManager.addListener(myListener);
        expect(LocationManager._listeners).toStrictEqual([myListener]);
        expect(myListener).toHaveBeenCalledWith(location);
        expect(myListener).toHaveBeenCalledTimes(1);
      });
    });

    describe("#removeListener", () => {
      MLRNLocationModule.stop = jest.fn();

      test("removes selected listener", () => {
        // just two different functions
        const listenerA = jest.fn(() => "listenerA");
        const listenerB = () => "listenerB";

        LocationManager.addListener(listenerA);
        expect(LocationManager._listeners).toStrictEqual([listenerA]);
        expect(MLRNLocationModule.stop).not.toHaveBeenCalled();

        LocationManager.addListener(listenerB);
        expect(LocationManager._listeners).toStrictEqual([
          listenerA,
          listenerB,
        ]);
        expect(MLRNLocationModule.stop).not.toHaveBeenCalled();

        LocationManager.removeListener(listenerB);
        expect(LocationManager._listeners).toStrictEqual([listenerA]);
        expect(MLRNLocationModule.stop).not.toHaveBeenCalled();

        LocationManager.removeListener(listenerA);
        expect(LocationManager._listeners).toStrictEqual([]);
        expect(MLRNLocationModule.stop).toHaveBeenCalledTimes(1);
      });
    });

    describe("#removeAllListeners", () => {
      test("removes all listeners", () => {
        // just two different functions
        const listenerA = jest.fn(() => "listenerA");
        const listenerB = () => "listenerB";

        LocationManager.addListener(listenerA);
        expect(LocationManager._listeners).toStrictEqual([listenerA]);
        LocationManager.addListener(listenerB);
        expect(LocationManager._listeners).toStrictEqual([
          listenerA,
          listenerB,
        ]);

        LocationManager.removeAllListeners();
        expect(LocationManager._listeners).toStrictEqual([]);
      });
    });

    describe("#start", () => {
      jest.spyOn(MLRNLocationModule, "start");
      jest.spyOn(LocationModuleEventEmitter, "addListener");

      afterEach(() => {
        LocationManager._isListening = false;
      });

      test("starts native location manager and adds event emitter listener", () => {
        MLRNModule.LocationCallbackName = {
          Update: "MapboxUserLocationUpdate",
        };

        expect(LocationManager._isListening).toStrictEqual(false);

        LocationManager.start();

        expect(MLRNLocationModule.start).toHaveBeenCalledTimes(1);
        expect(LocationModuleEventEmitter.addListener).toHaveBeenCalledWith(
          MLRNModule.LocationCallbackName.Update,
          LocationManager.onUpdate,
        );

        expect(LocationManager._isListening).toStrictEqual(true);
      });

      test('passes "displacement"', () => {
        LocationManager.start(5); // displacement 5meters

        expect(MLRNLocationModule.start).toHaveBeenCalledTimes(1);
        expect(MLRNLocationModule.start).toHaveBeenCalledWith(5);
      });

      test("does not start when already listening", () => {
        // we're already listening
        LocationManager._isListening = true;

        expect(LocationManager._isListening).toStrictEqual(true);

        LocationManager.start();

        expect(MLRNLocationModule.start).not.toHaveBeenCalled();
        expect(LocationModuleEventEmitter.addListener).not.toHaveBeenCalled();
      });
    });

    describe("#stop", () => {
      test("stops native location manager", () => {
        // set listening to true
        LocationManager._isListening = true;

        // native location manager has no #stop exposed in tests?
        MLRNLocationModule.stop = jest.fn();
        MLRNModule.LocationCallbackName = {
          Update: "MapboxUserLocationUpdate",
        };

        expect(LocationManager._isListening).toStrictEqual(true);

        LocationManager.stop();

        expect(MLRNLocationModule.stop).toHaveBeenCalledTimes(1);
        expect(LocationManager.subscription.remove).toHaveBeenCalled();

        expect(LocationManager._isListening).toStrictEqual(false);
      });

      test("only removes event emitter listener when listening", () => {
        // set listening to true
        LocationManager._isListening = false;

        // native location manager has no #stop exposed in tests?
        MLRNLocationModule.stop = jest.fn();
        MLRNModule.LocationCallbackName = {
          Update: "MapboxUserLocationUpdate",
        };

        expect(LocationManager._isListening).toStrictEqual(false);

        LocationManager.stop();

        expect(MLRNLocationModule.stop).toHaveBeenCalledTimes(1);
        expect(LocationManager.subscription.remove).not.toHaveBeenCalled();
      });
    });

    describe("#setMinDisplacement", () => {
      test('calls native "setMinDisplacement"', () => {
        MLRNLocationModule.setMinDisplacement = jest.fn();
        LocationManager.setMinDisplacement(5);
        expect(MLRNLocationModule.setMinDisplacement).toHaveBeenCalledWith(5);
      });
    });

    describe("#onUpdate", () => {
      beforeEach(() => {
        LocationManager._lastKnownLocation = null;
      });

      test('sets "_lastKnownLocation"', () => {
        LocationManager.onUpdate(location);

        expect(LocationManager._lastKnownLocation).toStrictEqual(location);
      });

      test("calls listeners with location", () => {
        const listeners = [jest.fn(), jest.fn(), jest.fn()];

        listeners.forEach((listener) => {
          LocationManager.addListener(listener);
        });

        LocationManager.onUpdate(location);

        listeners.forEach((listener) => {
          expect(listener).toHaveBeenCalledTimes(1);
          expect(listener).toHaveBeenCalledWith(location);
        });
      });
    });
  });
});
