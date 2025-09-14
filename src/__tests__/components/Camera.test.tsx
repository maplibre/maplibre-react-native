import { render } from "@testing-library/react-native";
import { type Component, type ComponentProps, createRef } from "react";
import type { NativeMethods } from "react-native";

import {
  Camera,
  type CameraProps,
  type CameraRef,
  type CameraStop,
} from "../../components/camera/Camera";
import NativeCameraComponent from "../../components/camera/NativeCameraComponent";
import type { Bounds } from "../../types/Bounds";
import type { ViewPadding } from "../../types/ViewPadding";

const mockCameraNativeRef = createRef<
  Component<ComponentProps<typeof NativeCameraComponent>> &
    Readonly<NativeMethods>
>();
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

const CENTER = { longitude: 1, latitude: 2 };
const BOUNDS: Bounds = [1, 2, 3, 4];
const PADDING: ViewPadding = { top: 1, right: 2, bottom: 3, left: 4 };

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
        longitude: -111.8678,
        latitude: 40.2866,
        zoom: 16,
      };

      const { getByTestId } = renderCamera({
        initialViewState: defaultSettings,
      });

      expect(getByTestId("Camera").props.defaultStop).toStrictEqual({
        centerCoordinate:
          '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
        zoom: 16,
      });
    });

    describe("buildNativeStop", () => {
      const configWithoutBounds: CameraProps = {
        duration: 2000,
        easing: "fly",
        pitch: 45,
        bearing: 110,
        zoom: 9,
      };

      const configWithBounds: CameraProps = {
        duration: 500,
        easing: "ease",
        bounds: BOUNDS,
        padding: PADDING,
        bearing: 100,
        pitch: 45,
        zoom: 11,
      };

      test('returns correct "stopConfig" without bounds', () => {
        const { rerender, setNativePropsSpy } =
          renderCamera(configWithoutBounds);
        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            zoom: 9,
            bearing: 110,
            pitch: 45,
            easing: "fly",
            duration: 2000,
          },
        });

        rerender({
          ...configWithoutBounds,
          ...CENTER,
        });
        expect(setNativePropsSpy).toHaveBeenLastCalledWith({
          stop: {
            ...CENTER,
            duration: 2000,
            easing: "fly",
            zoom: 9,
            bearing: 110,
            pitch: 45,
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
          longitude: 0,
          latitude: 0,
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
        const { setNativePropsSpy } = renderCamera({ maxBounds: BOUNDS });
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          maxBounds: BOUNDS_STRING,
        });
      });
    });
  });

  describe("updates", () => {
    test('updates when "followUserLocation" changes', () => {
      const { rerender, setNativePropsSpy } = renderCamera({
        trackUserLocation: undefined,
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        trackUserLocation: undefined,
      });

      rerender({ trackUserLocation: "default" });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        trackUserLocation: "default",
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

    test("updates when minZoom changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        minZoom: undefined,
      });

      rerender({ minZoom: 5 });
      expect(setNativePropsSpy).toHaveBeenCalledWith({ minZoom: 5 });
    });

    test("updates when maxZoom changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxZoom: undefined,
      });

      rerender({ maxZoom: 5 });
      expect(setNativePropsSpy).toHaveBeenCalledWith({
        maxZoom: 5,
      });
    });

    test("updates when follow user props change", () => {
      const { rerender, setNativePropsSpy } = renderCamera({
        trackUserLocation: "default",
      });

      expect(setNativePropsSpy).toHaveBeenLastCalledWith({
        followUserLocation: true,
        followUserMode: undefined,
        followHeading: undefined,
        followPitch: undefined,
        followZoom: undefined,
      });

      rerender({
        trackUserLocation: "default",
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        trackUserLocation: "default",
        followHeading: undefined,
        followPitch: undefined,
        followZoom: undefined,
      });

      rerender({
        trackUserLocation: "heading",
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        followUserMode: undefined,
        followHeading: undefined,
        followPitch: undefined,
        followZoom: undefined,
      });

      rerender({
        trackUserLocation: "heading",
      });

      expect(setNativePropsSpy).toHaveBeenCalledWith({
        trackUserLocation: "heading",
        followHeading: undefined,
        followPitch: undefined,
        followZoom: undefined,
      });
    });

    test("updates when CameraStop changes", () => {
      const { rerender, setNativePropsSpy } = renderCamera();
      expect(setNativePropsSpy).toHaveBeenCalledWith({ stop: {} });

      rerender({ longitude: 0, latitude: 0 });

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
      test('works without provided "padding" and/ or "duration"', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();

        cameraRef.current.fitBounds(BOUNDS);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(BOUNDS);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });

        jest.clearAllMocks();
        cameraRef.current.fitBounds(BOUNDS);

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Ease",
            bounds: BOUNDS_STRING,
          },
        });
      });

      test("works with `padding` being an array of four numbers", () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.fitBounds(BOUNDS, {
          padding: { top: 3, right: 5, bottom: 8, left: 10 },
          duration: 500,
        });

        expect(setNativePropsSpy).toHaveBeenCalledWith({
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
        });
      });
    });

    describe("flyTo", () => {
      test('sets default "animationDuration" when called without it', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.flyTo({
          center: { longitude: -111.8678, latitude: 40.2866 },
        });

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            duration: 2000,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });

      test('calls "setStop" with correct config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.flyTo({
          center: { longitude: -111.8678, latitude: 40.2866 },
          duration: 1234,
        });

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            duration: 1234,
            centerCoordinate:
              '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-111.8678,40.2866]}}',
          },
        });
      });
    });

    describe("easeTo", () => {
      test('sets default "animationDuration" when called without it', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.easeTo({
          center: { longitude: -111.8678, latitude: 40.2866 },
        });
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
        cameraRef.current.easeTo({ center: CENTER, duration: 5000 });
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

      test('calls "setStop" with correct config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current.zoomTo(10, { duration: 3000 });
        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {
            mode: "Flight",
            duration: 3000,
            zoom: 10,
          },
        });
      });
    });

    describe("setStop", () => {
      test('sets default config when called without "config', () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        cameraRef.current?.setStop({});

        expect(setNativePropsSpy).toHaveBeenCalledWith({
          stop: {},
        });
      });

      test("passes CameraStop to ", () => {
        const { setNativePropsSpy, cameraRef } = renderCamera();
        const config: CameraStop = {
          bounds: {
            ...BOUNDS,
          },
          padding: {
            top: 1,
            right: 2,
            bottom: 3,
            left: 4,
          },
          zoom: 11,
          bearing: 100,
          pitch: 45,
          easing: "ease",
          duration: 500,
        };

        cameraRef.current.setStop(config);

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
    });
  });
});
