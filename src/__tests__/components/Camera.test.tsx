import {
  Camera,
  type CameraProps,
  type CameraRef,
  type CameraStop,
  type LngLat,
  type LngLatBounds,
  type ViewPadding,
} from "@maplibre/maplibre-react-native";
import { render } from "@testing-library/react-native";
import { createRef } from "react";

import { mockNativeModules } from "../__mocks__/NativeModules.mock";

const TEST_ID = "MLRNCamera";

function renderCamera(props: CameraProps = {}) {
  const cameraRef = createRef<CameraRef>();

  const result = render(<Camera testID={TEST_ID} {...props} ref={cameraRef} />);

  if (cameraRef.current === null) {
    throw new Error("Refs can't be null");
  }

  function rerender(newProps: CameraProps) {
    return result.rerender(
      <Camera testID={TEST_ID} {...newProps} ref={cameraRef} />,
    );
  }

  return {
    ...result,
    cameraRef: { current: cameraRef.current },
    rerender,
  };
}

const CENTER: LngLat = [1, 2];
const BOUNDS: LngLatBounds = [1, 2, 3, 4];
const PADDING: ViewPadding = { top: 1, right: 2, bottom: 3, left: 4 };

describe("Camera", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renders", () => {
    test("correctly", () => {
      const { getByTestId } = renderCamera();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });

    test("with default props", () => {
      const { getByTestId } = renderCamera();

      expect(getByTestId(TEST_ID).props).toMatchObject({
        testID: TEST_ID,
      });
    });

    test("passes `initialViewState`", () => {
      const initialViewState = {
        longitude: -111.8678,
        latitude: 40.2866,
        zoom: 16,
      };
      const { getByTestId } = renderCamera({
        initialViewState,
      });

      expect(getByTestId(TEST_ID).props.initialViewState).toStrictEqual(
        initialViewState,
      );
    });

    describe("stop prop", () => {
      const propsWithoutBounds: CameraProps = {
        zoom: 9,
        bearing: 90,
        pitch: 135,
        padding: PADDING,
        duration: 1234,
        easing: "fly",
      };
      const propsWithBounds: CameraProps = {
        bounds: BOUNDS,
        zoom: 10,
        bearing: 45,
        pitch: 90,
        padding: PADDING,
        duration: 5678,
        easing: "ease",
      };

      test("without center", () => {
        const { rerender, getByTestId } = renderCamera({
          ...propsWithoutBounds,
          ...CENTER,
        });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });

        rerender(propsWithBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(propsWithBounds);
      });

      test("without bounds", () => {
        const { rerender, getByTestId } = renderCamera(propsWithoutBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(
          propsWithoutBounds,
        );

        rerender({ ...propsWithoutBounds, ...CENTER });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });
      });

      test("with bounds", () => {
        const { rerender, getByTestId } = renderCamera(propsWithBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(propsWithBounds);

        rerender({ ...propsWithoutBounds, ...CENTER });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });
      });
    });

    describe("direct props", () => {
      test("`minZoom`", () => {
        const { getByTestId, rerender } = renderCamera({ minZoom: 3 });

        expect(getByTestId(TEST_ID).props.minZoom).toBe(3);

        rerender({ minZoom: 7 });

        expect(getByTestId(TEST_ID).props.minZoom).toBe(7);
      });

      test("`maxZoom`", () => {
        const { getByTestId, rerender } = renderCamera({ maxZoom: 12 });

        expect(getByTestId(TEST_ID).props.maxZoom).toBe(12);

        rerender({ maxZoom: 18 });

        expect(getByTestId(TEST_ID).props.maxZoom).toBe(18);
      });

      test("`maxBounds`", () => {
        const { getByTestId, rerender } = renderCamera({ maxBounds: BOUNDS });

        expect(getByTestId(TEST_ID).props.maxBounds).toStrictEqual(BOUNDS);

        rerender({ maxBounds: [5, 6, 7, 8] });

        expect(getByTestId(TEST_ID).props.maxBounds).toStrictEqual([
          5, 6, 7, 8,
        ]);
      });

      test("`trackUserLocation`", () => {
        const { getByTestId, rerender } = renderCamera({
          trackUserLocation: "default",
        });

        expect(getByTestId(TEST_ID).props.trackUserLocation).toBe("default");

        rerender({ trackUserLocation: "heading" });

        expect(getByTestId(TEST_ID).props.trackUserLocation).toBe("heading");
      });

      test("`onTrackUserLocationChange`", () => {
        const handler = jest.fn();
        const { getByTestId, rerender } = renderCamera({
          onTrackUserLocationChange: handler,
        });

        expect(getByTestId(TEST_ID).props.onTrackUserLocationChange).toBe(
          handler,
        );

        const handler2 = jest.fn();
        rerender({ onTrackUserLocationChange: handler2 });

        expect(getByTestId(TEST_ID).props.onTrackUserLocationChange).toBe(
          handler2,
        );
      });
    });
  });

  describe("imperative methods", () => {
    test("are exposed", () => {
      const { cameraRef } = renderCamera();

      expect(cameraRef.current).toBeDefined();
      expect(typeof cameraRef.current.jumpTo).toBe("function");
      expect(typeof cameraRef.current.easeTo).toBe("function");
      expect(typeof cameraRef.current.flyTo).toBe("function");
      expect(typeof cameraRef.current.fitBounds).toBe("function");
      expect(typeof cameraRef.current.zoomTo).toBe("function");
      expect(typeof cameraRef.current.setStop).toBe("function");
    });

    test("`jumpTo` calls `setStop`", () => {
      const { cameraRef } = renderCamera();
      cameraRef.current.jumpTo({
        center: [1, 2],
        zoom: 5,
      });

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          center: [1, 2],
          zoom: 5,
          duration: 0,
          easing: undefined,
        }),
      );
    });

    test("`easeTo` calls `setStop`", () => {
      const { cameraRef } = renderCamera();
      cameraRef.current.easeTo({
        center: [3, 4],
        zoom: 7,
      });

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          center: [3, 4],
          zoom: 7,
          duration: 500,
          easing: "ease",
        }),
      );
    });

    test("`flyTo` calls `setStop`", () => {
      const { cameraRef } = renderCamera();
      cameraRef.current.flyTo({
        center: [5, 6],
        zoom: 8,
      });

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          center: [5, 6],
          zoom: 8,
          duration: 2000,
          easing: "fly",
        }),
      );
    });

    test("`fitBounds` calls `setStop`", () => {
      const { cameraRef } = renderCamera();
      cameraRef.current.fitBounds([1, 2, 3, 4]);

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          bounds: [1, 2, 3, 4],
          duration: 2000,
          easing: "fly",
        }),
      );
    });

    test("`zoomTo` calls `setStop`", () => {
      const { cameraRef } = renderCamera();
      cameraRef.current.zoomTo(10);

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ zoom: 10, duration: 500, easing: "ease" }),
      );
    });

    test("`setStop` calls correctly", () => {
      const { cameraRef } = renderCamera();
      const stop = {
        center: [7, 8],
        zoom: 9,
        duration: 1000,
        easing: "linear",
      } as const satisfies CameraStop;
      cameraRef.current.setStop(stop);

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining(stop),
      );
    });
  });
});
