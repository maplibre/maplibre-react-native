import { NativeUserLocation } from "@maplibre/maplibre-react-native";
import { render } from "@testing-library/react-native";

const TEST_ID = "MLRNNativeUserLocation";

describe("NativeUserLocation", () => {
  describe("renders", () => {
    test("correctly with no props", () => {
      const { getByTestId } = render(<NativeUserLocation testID={TEST_ID} />);

      expect(getByTestId(TEST_ID)).toBeDefined();
    });

    test("with default mode when mode is not specified", () => {
      const { getByTestId } = render(<NativeUserLocation testID={TEST_ID} />);

      expect(getByTestId(TEST_ID).props.mode).toBeUndefined();
    });

    test('with mode="default"', () => {
      const { getByTestId } = render(
        <NativeUserLocation testID={TEST_ID} mode="default" />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("default");
    });

    test('with mode="heading"', () => {
      const { getByTestId } = render(
        <NativeUserLocation testID={TEST_ID} mode="heading" />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("heading");
    });

    test('with mode="course"', () => {
      const { getByTestId } = render(
        <NativeUserLocation testID={TEST_ID} mode="course" />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("course");
    });

    test("with androidPreferredFramesPerSecond prop", () => {
      const { getByTestId } = render(
        <NativeUserLocation
          testID={TEST_ID}
          androidPreferredFramesPerSecond={30}
        />,
      );

      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        30,
      );
    });

    test("with both mode and androidPreferredFramesPerSecond props", () => {
      const { getByTestId } = render(
        <NativeUserLocation
          testID={TEST_ID}
          mode="heading"
          androidPreferredFramesPerSecond={60}
        />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("heading");
      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        60,
      );
    });
  });

  describe("re-rendering", () => {
    test("updates mode prop when re-rendered", () => {
      const { getByTestId, rerender } = render(
        <NativeUserLocation testID={TEST_ID} mode="default" />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("default");

      rerender(<NativeUserLocation testID={TEST_ID} mode="heading" />);

      expect(getByTestId(TEST_ID).props.mode).toBe("heading");
    });

    test("updates androidPreferredFramesPerSecond prop when re-rendered", () => {
      const { getByTestId, rerender } = render(
        <NativeUserLocation
          testID={TEST_ID}
          androidPreferredFramesPerSecond={30}
        />,
      );

      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        30,
      );

      rerender(
        <NativeUserLocation
          testID={TEST_ID}
          androidPreferredFramesPerSecond={60}
        />,
      );

      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        60,
      );
    });

    test("updates both props when re-rendered", () => {
      const { getByTestId, rerender } = render(
        <NativeUserLocation
          testID={TEST_ID}
          mode="default"
          androidPreferredFramesPerSecond={30}
        />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("default");
      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        30,
      );

      rerender(
        <NativeUserLocation
          testID={TEST_ID}
          mode="course"
          androidPreferredFramesPerSecond={120}
        />,
      );

      expect(getByTestId(TEST_ID).props.mode).toBe("course");
      expect(getByTestId(TEST_ID).props.androidPreferredFramesPerSecond).toBe(
        120,
      );
    });
  });
});
