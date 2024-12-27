import { render } from "@testing-library/react-native";
import { createRef } from "react";

import {
  Camera,
  type CameraBounds,
  type CameraProps,
  type CameraRef,
  type CameraStop,
  type CameraStops,
  getNativeCameraMode,
  type NativeCameraProps,
  UserTrackingMode,
} from "../../components/Camera";
import { type NativeRef } from "../../hooks/useNativeRef";

const mockCameraNativeRef = createRef<NativeRef<NativeCameraProps>>();
jest.mock("../../hooks/useNativeRef", () => ({
  useNativeRef: () => {
    return mockCameraNativeRef;
  },
}));

function renderCamera(props: CameraProps = {}) {
  const cameraRef = createRef<CameraRef>();

  const result = render(<Camera {...props} ref={cameraRef} />);

  if (cameraRef.current === null || mockCameraNativeRef.current === null) {
    throw new Error("Refs can't be null");
  }

  const setNativePropsSpy = jest.spyOn(
    mockCameraNativeRef.current,
    "setNativeProps",
  );

  function rerender(newProps: CameraProps) {
    return result.rerender(<Camera {...newProps} ref={cameraRef} />);
  }

  return {
    ...result,
    cameraRef: { current: cameraRef.current },
    rerender,
    setNativePropsSpy,
  };
}

const BOUNDS: Readonly<CameraBounds> = { ne: [1, 1], sw: [0, 0] };

const BOUNDS_STRING: Readonly<string> =
  '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[1,1]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}}]}';

describe("Camera", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    test("renders correctly", () => {
      const { getByTestId } = render(<Camera />);

      expect(getByTestId("Camera")).toBeDefined();
    });

    test("with default props", () => {
      const { getByTestId } = render(<Camera />);

      expect(getByTestId("Camera").props).toStrictEqual({
        children: undefined,
        testID: "Camera",
        defaultStop: undefined,
        onUserTrackingModeChange: undefined,
      });
    });

    test("builds `defaultStop` with `defaultSettings`", () => {
      const defaultSettings = {
        centerCoordinate: [-111.8678, 40.2866],
        zoomLevel: 16,
      };

      const { getByTestId } = renderCamera({ defaultSettings });

      expect(getByTestId("Camera").props.defaultStop).toStrictEqual({
        centerCoordinate:
          '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
        zoom: 16,
      });
    });

    describe("buildNativeStop", () => {
      const configWithoutBounds: CameraProps = {
        animationDuration: 2000,
        animationMode: "flyTo",
        pitch: 45,
        heading: 110,
        zoomLevel: 9,
      };

      const configWithBounds: CameraProps = {
        animationDuration: 500,
        animationMode: "easeTo",
        bounds: {
          ...BOUNDS,
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 3,
        },
        heading: 100,
        pitch: 45,
        zoomLevel: 11,
      };

      test('returns correct "stopConfig" without bounds', () => {
        const { rerender, setNativePropsSpy } =
          renderCamera(configWithoutBounds);
        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            duration: 2000,
            mode: "Flight",
            heading: 110,
            pitch: 45,
            zoom: 9,
          },
        });

        rerender({
          ...configWithoutBounds,
          centerCoordinate: [0, 0],
        });
        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}}',
            duration: 2000,
            mode: "Flight",
            heading: 110,
            pitch: 45,
            zoom: 9,
          },
        });
      });

      test('returns correct "stopConfig" with bounds', () => {
        const { rerender, setNativePropsSpy } = renderCamera(configWithBounds);

        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            bounds: BOUNDS_STRING,
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

        rerender({
          ...configWithoutBounds,
          centerCoordinate: [0, 0],
        });
        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}}',
            duration: 2000,
            mode: "Flight",
            heading: 110,
            pitch: 45,
            zoom: 9,
          },
        });
      });
    });

    describe("maxBounds", () => {
      test("are undefined when missing", () => {
        const { rerender, setNativePropsSpy } = renderCamera();
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          maxBounds: undefined,
        });

        // @ts-expect-error
        rerender({ maxBounds: { ne: [1, 1] } });
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          maxBounds: undefined,
        });

        // @ts-expect-error
        renderCamera({ maxBounds: { sw: [0, 0] } });
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          maxBounds: undefined,
        });
      });

      test('returns maxBounds when "maxBounds" property is set', () => {
        const maxBounds = {
          ne: [1, 1],
          sw: [0, 0],
        };

        const { setNativePropsSpy } = renderCamera({ maxBounds });
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          maxBounds: BOUNDS_STRING,
        });
      });
    });
  });

  describe("updates", () => {
    test('updates when "followUserLocation" changes', () => {
      const { rerender, setNativePropsSpy } = renderCamera({
        followUserLocation: false,
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserLocation: false,
      });

      rerender({ followUserLocation: true });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserLocation: true,
      });
    });

    test("updates when maxBounds change", () => {
      const { rerender, setNativePropsSpy } = renderCamera();
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxBounds: undefined,
      });

      rerender({ maxBounds: BOUNDS });
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxBounds: BOUNDS_STRING,
      });
    });

    test("updates when minZoomLevel changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        minZoomLevel: undefined,
      });

      rerender({ minZoomLevel: 5 });
      expect(setNativePropsSpy).toHaveBeenCalledWith({ minZoomLevel: 5 });
    });

    test("updates when maxZoomLevel changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxZoomLevel: undefined,
      });

      rerender({ maxZoomLevel: 5 });
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxZoomLevel: 5,
      });
    });

    test("updates when follow user props change", () => {
      const { rerender, setNativePropsSpy } = renderCamera({
        followUserLocation: true,
      });

      expect(setNativePropsSpy).toHaveBeenLastCalledWith({
        followUserLocation: true,
        followUserMode: undefined,
        followHeading: undefined,
        followPitch: undefined,
        followZoomLevel: undefined,
      });

      rerender({
        followUserLocation: true,
        followUserMode: UserTrackingMode.Follow,
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserMode: UserTrackingMode.Follow,
        followHeading: undefined,
        followPitch: undefined,
        followZoomLevel: undefined,
      });

      rerender({
        followUserMode: UserTrackingMode.FollowWithHeading,
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserMode: undefined,
        followHeading: undefined,
        followPitch: undefined,
        followZoomLevel: undefined,
      });

      rerender({
        followUserLocation: true,
        followUserMode: UserTrackingMode.FollowWithHeading,
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserMode: UserTrackingMode.FollowWithHeading,
        followHeading: undefined,
        followPitch: undefined,
        followZoomLevel: undefined,
      });
    });

    test("updates when CameraStop changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();
      expect(setNativePropsSpy).toHaveBeenCalledWith({ stop: {} });

      rerender({ centerCoordinate: [0, 0] });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        stop: {
          centerCoordinate:
            '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}}',
        },
      });
    });
  });

  describe("imperative methods", () => {
    describe("fitBounds", () => {
      test('works without provided "padding" and/ or "animationDuration"', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();

        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });
      });

      // TODO: Refactor #fitBounds to throw when ne or sw aren't provided
      // This is a public method and people will call it with all sorts of data
      test.skip('throws when "ne" or "sw" are missing', () => {});

      test('works with "padding" being a single number', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw, 3, 500);

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
            bounds: BOUNDS_STRING,
          },
        });
      });

      test('works with "padding" being an array of two numbers', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw, [3, 5], 500);

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
            bounds: BOUNDS_STRING,
          },
        });
      });

      test("works with `padding` being an array of four numbers", () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(BOUNDS.ne, BOUNDS.sw, [3, 5, 8, 10], 500);

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
            bounds: BOUNDS_STRING,
          },
        });
      });
    });

    describe("flyTo", () => {
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
            duration: 2000,
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
            duration: 5000,
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
            duration: 0,
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
            duration: 5000,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });
    });

    describe("zoomTo", () => {
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
            duration: 2000,
            zoom: 10,
          },
        });
      });

      test('calls "_setCamera" with correct config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.zoomTo(10, 3000);
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            duration: 3000,
            zoom: 10,
          },
        });
      });
    });

    describe("setCamera", () => {
      test('sets default config when called without "config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current?.setCamera({});

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {},
        });
      });

      test('passes stopConfig to "setNativeProps"', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        const config: CameraStop = {
          animationDuration: 500,
          animationMode: "easeTo",
          bounds: {
            ...BOUNDS,
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 5,
            paddingTop: 3,
          },
          heading: 100,
          pitch: 45,
          zoomLevel: 11,
        };

        cameraRef.current.setCamera(config);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            bounds: BOUNDS_STRING,
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
        const config: CameraStops = {
          stops: [
            {
              animationDuration: 50,
              animationMode: "easeTo",
              bounds: {
                ...BOUNDS,

                paddingBottom: 2,
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
              },
              heading: 20,
              pitch: 25,
              zoomLevel: 16,
            },
            {
              animationDuration: 3000,
              animationMode: "flyTo",
              bounds: {
                ne: BOUNDS.sw,
                sw: [-1, -1],

                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
              },
              heading: 40,
              pitch: 45,
              zoomLevel: 8,
            },
            {
              animationDuration: 500,
              animationMode: "easeTo",
              bounds: {
                ...BOUNDS,

                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 5,
                paddingTop: 3,
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
                bounds: BOUNDS_STRING,
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
                  '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0,0]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-1,-1]}}]}',
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
                bounds: BOUNDS_STRING,
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
  });

  describe("utils", () => {
    describe("nativeAnimationMode", () => {
      test('returns "Flight" for "flyTo"', () => {
        expect(getNativeCameraMode("flyTo")).toStrictEqual("Flight");
      });

      test('returns "None" for "moveTo"', () => {
        expect(getNativeCameraMode("moveTo")).toStrictEqual("None");
      });

      test('returns "None" as default', () => {
        expect(getNativeCameraMode()).toStrictEqual("None");
      });
    });
  });
});
