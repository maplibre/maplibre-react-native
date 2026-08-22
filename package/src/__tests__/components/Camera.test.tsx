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

async function renderCamera(props: CameraProps = {}) {
  const cameraRef = createRef<CameraRef>();

  const result = await render(
    <Camera testID={TEST_ID} {...props} ref={cameraRef} />,
  );

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
    test("correctly", async () => {
      const { getByTestId } = await renderCamera();

      expect(getByTestId(TEST_ID)).toBeDefined();
    });

    test("with default props", async () => {
      const { getByTestId } = await renderCamera();

      expect(getByTestId(TEST_ID).props).toMatchObject({
        testID: TEST_ID,
      });
    });

    test("passes `initialViewState`", async () => {
      const initialViewState = {
        longitude: -111.8678,
        latitude: 40.2866,
        zoom: 16,
      };
      const { getByTestId } = await renderCamera({
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

      test("without center", async () => {
        const { rerender, getByTestId } = await renderCamera({
          ...propsWithoutBounds,
          ...CENTER,
        });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });

        await rerender(propsWithBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(propsWithBounds);
      });

      test("without bounds", async () => {
        const { rerender, getByTestId } =
          await renderCamera(propsWithoutBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(
          propsWithoutBounds,
        );

        await rerender({ ...propsWithoutBounds, ...CENTER });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });
      });

      test("with bounds", async () => {
        const { rerender, getByTestId } = await renderCamera(propsWithBounds);

        expect(getByTestId(TEST_ID).props.stop).toMatchObject(propsWithBounds);

        await rerender({ ...propsWithoutBounds, ...CENTER });

        expect(getByTestId(TEST_ID).props.stop).toMatchObject({
          ...propsWithoutBounds,
          ...CENTER,
        });
      });
    });

    describe("direct props", () => {
      test("`minZoom`", async () => {
        const { getByTestId, rerender } = await renderCamera({ minZoom: 3 });

        expect(getByTestId(TEST_ID).props.minZoom).toBe(3);

        await rerender({ minZoom: 7 });

        expect(getByTestId(TEST_ID).props.minZoom).toBe(7);
      });

      test("`maxZoom`", async () => {
        const { getByTestId, rerender } = await renderCamera({ maxZoom: 12 });

        expect(getByTestId(TEST_ID).props.maxZoom).toBe(12);

        await rerender({ maxZoom: 18 });

        expect(getByTestId(TEST_ID).props.maxZoom).toBe(18);
      });

      test("`maxBounds`", async () => {
        const { getByTestId, rerender } = await renderCamera({
          maxBounds: BOUNDS,
        });

        expect(getByTestId(TEST_ID).props.maxBounds).toStrictEqual(BOUNDS);

        await rerender({ maxBounds: [5, 6, 7, 8] });

        expect(getByTestId(TEST_ID).props.maxBounds).toStrictEqual([
          5, 6, 7, 8,
        ]);
      });

      test("`trackUserLocation`", async () => {
        const { getByTestId, rerender } = await renderCamera({
          trackUserLocation: "default",
        });

        expect(getByTestId(TEST_ID).props.trackUserLocation).toBe("default");

        await rerender({ trackUserLocation: "heading" });

        expect(getByTestId(TEST_ID).props.trackUserLocation).toBe("heading");
      });

      test("`onTrackUserLocationChange`", async () => {
        const handler = jest.fn();
        const { getByTestId, rerender } = await renderCamera({
          onTrackUserLocationChange: handler,
        });

        expect(getByTestId(TEST_ID).props.onTrackUserLocationChange).toBe(
          handler,
        );

        const handler2 = jest.fn();
        await rerender({ onTrackUserLocationChange: handler2 });

        expect(getByTestId(TEST_ID).props.onTrackUserLocationChange).toBe(
          handler2,
        );
      });
    });
  });

  describe("imperative methods", () => {
    test("are exposed", async () => {
      const { cameraRef } = await renderCamera();

      expect(cameraRef.current).toBeDefined();
      expect(typeof cameraRef.current.jumpTo).toBe("function");
      expect(typeof cameraRef.current.easeTo).toBe("function");
      expect(typeof cameraRef.current.flyTo).toBe("function");
      expect(typeof cameraRef.current.fitBounds).toBe("function");
      expect(typeof cameraRef.current.zoomTo).toBe("function");
      expect(typeof cameraRef.current.setStop).toBe("function");
    });

    test("`jumpTo` calls `setStop`", async () => {
      const { cameraRef } = await renderCamera();
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

    test("`easeTo` calls `setStop`", async () => {
      const { cameraRef } = await renderCamera();
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

    test("`flyTo` calls `setStop`", async () => {
      const { cameraRef } = await renderCamera();
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

    test("`fitBounds` calls `setStop`", async () => {
      const { cameraRef } = await renderCamera();
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

    test("`zoomTo` calls `setStop`", async () => {
      const { cameraRef } = await renderCamera();
      cameraRef.current.zoomTo(10);

      expect(mockNativeModules.MLRNCameraModule.setStop).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ zoom: 10, duration: 500, easing: "ease" }),
      );
    });

    test("`setStop` calls correctly", async () => {
      const { cameraRef } = await renderCamera();
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
