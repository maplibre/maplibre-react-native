import { render } from "@testing-library/react-native";
import React from "react";

import Camera from "../../javascript/components/Camera";

const mockCameraNativeRef = React.createRef();
jest.mock("../../javascript/hooks/useNativeRef", () => ({
  useNativeRef: () => {
    return mockCameraNativeRef;
  },
}));

function renderCamera(props = {}) {
  const cameraRef = React.createRef();

  const { rerender } = render(<Camera {...props} ref={cameraRef} />);

  const setNativePropsSpy = jest.spyOn(
    mockCameraNativeRef.current,
    "setNativeProps",
  );

  function rerenderCamera(newProps) {
    return rerender(<Camera {...newProps} ref={cameraRef} />);
  }

  return {
    cameraRef,
    rerenderCamera,
    setNativePropsSpy,
  };
}

describe("Camera", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    test("renders correctly", () => {
      const { getByTestId } = render(<Camera />);

      expect(getByTestId("Camera")).toBeDefined();
    });

    test("has proper default props", () => {
      const { getByTestId } = render(<Camera />);

      expect(getByTestId("Camera").props).toStrictEqual({
        children: undefined,
        testID: "Camera",
        followUserLocation: undefined,
        followUserMode: undefined,
        followPitch: undefined,
        followHeading: undefined,
        followZoomLevel: undefined,
        stop: {
          mode: "Ease",
          pitch: undefined,
          heading: undefined,
          duration: 2000,
          zoom: undefined,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        },
        maxZoomLevel: undefined,
        minZoomLevel: undefined,
        maxBounds: null,
        defaultStop: null,
        onUserTrackingModeChange: undefined,
      });
    });
  });

  describe("updates", () => {
    test('updates when "followUserLocation" changes', () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera({
        followUserLocation: false,
      });

      rerenderCamera({ followUserLocation: true });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserLocation: true,
      });

      jest.resetAllMocks();
      rerenderCamera({ followUserLocation: false, allowUpdates: false });

      expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    });

    test("updates when maxBounds change", () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera();

      rerenderCamera({
        maxBounds: { ne: [-74.12641, 40.797968], sw: [-74.143727, 40.772177] },
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxBounds:
          '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.12641,40.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
      });

      jest.resetAllMocks();

      rerenderCamera({
        allowUpdates: false,
        maxBounds: {
          ne: [-74.12641, 30.797968],
          sw: [-74.143727, 30.772177],
        },
      });

      expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    });

    test("updates when minZoomLevel changes", () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera();
      rerenderCamera({ minZoomLevel: 5 });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        minZoomLevel: 5,
      });

      jest.resetAllMocks();
      rerenderCamera({ minZoomLevel: 3, allowUpdates: false });
      expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    });

    test("updates when maxZoomLevel changes", () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera();
      rerenderCamera({ maxZoomLevel: 5 });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxZoomLevel: 5,
      });

      jest.resetAllMocks();
      rerenderCamera({ maxZoomLevel: 2, allowUpdates: false });
      expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    });

    test("updates when follow user props change", () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera({
        followUserLocation: true,
      });

      rerenderCamera({
        followUserLocation: true,
        followUserMode: "normal",
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserMode: "normal",
        followHeading: undefined,
        followPitch: undefined,
        followZoomLevel: undefined,
      });

      rerenderCamera({
        followUserLocation: false,
        followUserMode: "compass",
      });

      // it only sends `followUserLocation` when it changes
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserLocation: false,
      });
    });

    test("updates when cameraConfig changes", () => {
      const { rerenderCamera, setNativePropsSpy } = renderCamera();

      jest.resetAllMocks();
      rerenderCamera({ animationMode: "linear" });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        stop: {
          duration: 2000,
          heading: undefined,
          mode: "Ease",
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          pitch: undefined,
          zoom: undefined,
        },
      });

      jest.resetAllMocks();
      rerenderCamera({ allowUpdates: false, animationMode: "flight" });
      expect(setNativePropsSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("methods", () => {
    describe("#fitBounds", () => {
      const ne = [-63.12641, 39.797968];
      const sw = [-74.143727, 40.772177];

      test('works without provided "padding" and/ or "animationDuration"', () => {
        // FIXME: animationDuration and padding of null lead to malformed setCamera config

        const { setNativePropsSpy, cameraRef } = renderCamera();

        cameraRef.current.fitBounds(ne, sw, null, null);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 0,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(ne, sw, null);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 0,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(ne, sw);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 0,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });
      });

      // TODO: Refactor #fitBounds to throw when ne or sw aren't provided
      // This is a public method and people will call it with all sorts of data
      test.skip('throws when "ne" or "sw" are missing', () => {});

      test('works with "padding" being a single number', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(ne, sw, 3, 500);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 500,
            zoom: undefined,
            paddingTop: 3,
            paddingRight: 3,
            paddingBottom: 3,
            paddingLeft: 3,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });
      });

      test('works with "padding" being an array of two numbers', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(ne, sw, [3, 5], 500);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 500,
            zoom: undefined,
            paddingTop: 3,
            paddingRight: 5,
            paddingBottom: 3,
            paddingLeft: 5,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });
      });

      test('works with "padding" being an array of four numbers', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(ne, sw, [3, 5, 8, 10], 500);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 500,
            zoom: undefined,
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 5,
            paddingTop: 3,
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          },
        });
      });
    });

    describe("#flyTo", () => {
      test.skip("throws when no coordinates are provided", () => {
        // TODO: Refactor #flyTo to throw when coordinates aren't provided
        // This is a public method and people will call it with all sorts of data
      });

      test('sets default "animationDuration" when called without it', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.flyTo([-111.8678, 40.2866]);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            pitch: undefined,
            heading: undefined,
            duration: 2000,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });

      test('calls "setCamera" with correct config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.flyTo([-111.8678, 40.2866], 5000);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            pitch: undefined,
            heading: undefined,
            duration: 5000,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });
    });

    describe("#moveTo", () => {
      test.skip("throws when no coordinates are provided", () => {
        // TODO: Refactor #moveTo to throw when coordinates aren't provided
        // This is a public method and people will call it with all sorts of data
      });

      test('sets default "animationDuration" when called without it', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.moveTo([-111.8678, 40.2866]);
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 0,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });

      test("calls native camera with correct config", () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.moveTo([-111.8678, 40.2866], 5000);
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 5000,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });
    });

    describe("#zoomTo", () => {
      test.skip("throws when no zoomLevel is provided", () => {
        // TODO: Refactor #moveTo to throw when coordinates aren't provided
        // This is a public method and people will call it with all sorts of data
      });

      test('sets default "animationDuration" when called without it', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.zoomTo(10);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            pitch: undefined,
            heading: undefined,
            duration: 2000,
            zoom: 10,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
          },
        });
      });

      test('calls "_setCamera" with correct config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.zoomTo(10, 3000);
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            pitch: undefined,
            heading: undefined,
            duration: 3000,
            zoom: 10,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
          },
        });
      });
    });

    describe("#setCamera", () => {
      test('sets default config when called without "config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.setCamera({});

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            pitch: undefined,
            heading: undefined,
            duration: 0,
            zoom: undefined,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
          },
        });
      });

      test('passes stopConfig to "setNativeProps"', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        const config = {
          animationDuration: 500,
          animationMode: "easeTo",
          bounds: {
            ne: [-63.12641, 39.797968],
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 5,
            paddingTop: 3,
            sw: [-74.143727, 40.772177],
          },
          heading: 100,
          pitch: 45,
          zoomLevel: 11,
        };

        cameraRef.current.setCamera(config);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            bounds:
              '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 5,
            paddingTop: 3,
            duration: 500,
            heading: 100,
            mode: "Ease",
            pitch: 45,
            zoom: 11,
          },
        });
      });

      test("creates multiple stops when provided", () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        const config = {
          stops: [
            {
              animationDuration: 50,
              animationMode: "easeTo",
              bounds: {
                ne: [-63.12641, 39.797968],
                paddingBottom: 2,
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                sw: [-74.143727, 40.772177],
              },
              heading: 20,
              pitch: 25,
              zoomLevel: 16,
            },
            {
              animationDuration: 3000,
              animationMode: "flyTo",
              bounds: {
                ne: [-63.12641, 59.797968],
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
                sw: [-71.143727, 40.772177],
              },
              heading: 40,
              pitch: 45,
              zoomLevel: 8,
            },
            {
              animationDuration: 500,
              animationMode: "easeTo",
              bounds: {
                ne: [-63.12641, 39.797968],
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
                sw: [-74.143727, 40.772177],
              },
              heading: 100,
              pitch: 45,
              zoomLevel: 11,
            },
          ],
        };

        cameraRef.current.setCamera(config);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            stops: [
              {
                bounds:
                  '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
                paddingBottom: 2,
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                duration: 50,
                heading: 20,
                mode: "Ease",
                pitch: 25,
                zoom: 16,
              },
              {
                bounds:
                  '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,59.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-71.143727,40.772177]}}]}',
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
                duration: 3000,
                heading: 40,
                mode: "Flight",
                pitch: 45,
                zoom: 8,
              },
              {
                bounds:
                  '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
                duration: 500,
                heading: 100,
                mode: "Ease",
                pitch: 45,
                zoom: 11,
              },
            ],
          },
        });
      });
    });

    describe("#_createDefaultCamera", () => {
      test('returns null without "defaultSettings"', () => {
        const ref = React.createRef();
        render(<Camera ref={ref} />);
        expect(ref.current._createDefaultCamera()).toBe(null);
      });

      test('returns "defaultCamera" with "defaultSettings" and sets property', () => {
        const defaultSettings = {
          centerCoordinate: [-111.8678, 40.2866],
          zoomLevel: 16,
        };

        const ref = React.createRef();
        render(<Camera ref={ref} defaultSettings={defaultSettings} />);

        const defaultCamera = {
          centerCoordinate:
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          duration: 0,
          heading: undefined,
          mode: "None",
          pitch: undefined,
          zoom: 16,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        };

        expect(ref.current._createDefaultCamera()).toStrictEqual(defaultCamera);
        expect(ref.current._defaultCamera.current).toStrictEqual(defaultCamera);
      });
    });

    describe("#_createStopConfig", () => {
      const configWithoutBounds = {
        animationDuration: 2000,
        pitch: 45,
        heading: 110,
        zoomLevel: 9,
      };

      const configWithBounds = {
        animationDuration: 500,
        animationMode: "easeTo",
        bounds: {
          ne: [-63.12641, 39.797968],
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 3,
          sw: [-74.143727, 40.772177],
        },
        heading: 100,
        pitch: 45,
        zoomLevel: 11,
      };

      test('returns null with "followUserLocation" prop and "!ignoreFollowUserLocation"', () => {
        const { cameraRef } = renderCamera({ followUserLocation: true });
        expect(cameraRef.current._createStopConfig()).toBe(null);
      });

      test('returns correct "stopConfig" without bounds', () => {
        const { cameraRef } = renderCamera();

        expect(
          cameraRef.current._createStopConfig(configWithoutBounds, true),
        ).toStrictEqual({
          duration: 2000,
          heading: 110,
          mode: "Ease",
          pitch: 45,
          zoom: 9,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        });

        // with centerCoordinate
        expect(
          cameraRef.current._createStopConfig(
            { ...configWithoutBounds, centerCoordinate: [-111.8678, 40.2866] },
            true,
          ),
        ).toStrictEqual({
          centerCoordinate:
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          duration: 2000,
          heading: 110,
          mode: "Ease",
          pitch: 45,
          zoom: 9,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        });
      });

      test('returns correct "stopConfig" with bounds', () => {
        const { cameraRef } = renderCamera();

        expect(
          cameraRef.current._createStopConfig(configWithBounds, true),
        ).toStrictEqual({
          bounds:
            '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 3,
          duration: 500,
          heading: 100,
          mode: "Ease",
          pitch: 45,
          zoom: 11,
        });

        // with centerCoordinate
        expect(
          cameraRef.current._createStopConfig(
            { ...configWithBounds, centerCoordinate: [-111.8678, 40.2866] },
            true,
          ),
        ).toStrictEqual({
          bounds:
            '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-63.12641,39.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 3,
          centerCoordinate:
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          duration: 500,
          heading: 100,
          mode: "Ease",
          pitch: 45,
          zoom: 11,
        });
      });
    });

    describe("#_getNativeCameraMode", () => {
      const ref = React.createRef();
      render(<Camera ref={ref} />);
      const camera = ref.current;

      test('returns "Flight" for "flyTo"', () => {
        expect(
          camera._getNativeCameraMode({ animationMode: "flyTo" }),
        ).toStrictEqual("Flight");
      });

      test('returns "None" for "moveTo"', () => {
        expect(
          camera._getNativeCameraMode({ animationMode: "moveTo" }),
        ).toStrictEqual("None");
      });

      test('returns "Ease" as default', () => {
        expect(camera._getNativeCameraMode({})).toStrictEqual("Ease");
      });
    });

    describe("#_getMaxBounds", () => {
      test('returns null if no "maxBounds"', () => {
        const { cameraRef, rerenderCamera } = renderCamera();

        expect(cameraRef.current._getMaxBounds()).toStrictEqual(null);

        rerenderCamera({ maxBounds: { ne: [-74.12641, 40.797968] } });
        expect(cameraRef.current._getMaxBounds()).toStrictEqual(null);

        renderCamera({ maxBounds: { sw: [-74.143727, 40.772177] } });
        expect(cameraRef.current._getMaxBounds()).toStrictEqual(null);
      });

      test('returns maxBounds when "maxBounds" property is set', () => {
        const maxBounds = {
          ne: [-74.12641, 40.797968],
          sw: [-74.143727, 40.772177],
        };

        const { cameraRef } = renderCamera({ maxBounds });

        expect(cameraRef.current._getMaxBounds()).toStrictEqual(
          '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.12641,40.797968]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-74.143727,40.772177]}}]}',
        );
      });
    });
  });
});
