import { render } from "@testing-library/react-native";
import { View } from "react-native";

import { Callout, type CalloutProps } from "../..";

const TEST_TITLE = "This is an example.";

describe("Callout", () => {
  test("renders with custom title", () => {
    const { getByText } = render(<Callout title={TEST_TITLE} />);

    expect(getByText(TEST_TITLE)).toBeDefined();
  });

  describe("with default children", () => {
    test("renders", () => {
      const { getByTestId } = render(<Callout testID="mlrn-callout" />);

      expect(getByTestId("mlrn-callout")).toBeDefined();
      expect(getByTestId("mlrn-callout-animated")).toBeDefined();
      expect(getByTestId("mlrn-callout-content")).toBeDefined();
      expect(getByTestId("mlrn-callout-title")).toBeDefined();
      expect(getByTestId("mlrn-callout-tip")).toBeDefined();
    });

    test("applies styles", () => {
      const TEST_PROPS = {
        testID: "mlrn-callout",
        style: { height: 1 },
        animatedStyle: { height: 2 },
        contentStyle: { height: 3 },
        tipStyle: { height: 4 },
        titleStyle: { height: 5 },
      } as const satisfies CalloutProps;
      const { getByTestId } = render(<Callout {...TEST_PROPS} />);

      expect(getByTestId("mlrn-callout").props.style[1]).toStrictEqual(
        TEST_PROPS.style,
      );
      expect(
        getByTestId("mlrn-callout-animated").props.style.height,
      ).toStrictEqual(TEST_PROPS.animatedStyle.height);
      expect(
        getByTestId("mlrn-callout-content").props.style[1].height,
      ).toStrictEqual(TEST_PROPS.contentStyle.height);
      expect(getByTestId("mlrn-callout-tip").props.style[1]).toStrictEqual(
        TEST_PROPS.tipStyle,
      );
      expect(getByTestId("mlrn-callout-title").props.style[1]).toStrictEqual(
        TEST_PROPS.titleStyle,
      );
    });
  });

  describe("custom children", () => {
    test("renders", () => {
      const { getByTestId, queryByTestId } = render(
        <Callout testID="mlrn-callout">
          <View testID="custom-view" />
        </Callout>,
      );

      expect(queryByTestId("mlrn-callout-title")).toBeNull();
      expect(getByTestId("custom-view")).toBeDefined();
    });

    test("applies styles", () => {
      const TEST_PROPS = {
        testID: "mlrn-callout",
        style: { height: 1 },
        animatedStyle: { height: 2 },
      } as const satisfies CalloutProps;
      const { getByTestId } = render(
        <Callout {...TEST_PROPS}>
          <View>Foo Bar</View>
        </Callout>,
      );

      expect(getByTestId("mlrn-callout").props.style[1]).toStrictEqual(
        TEST_PROPS.style,
      );
      expect(
        getByTestId("mlrn-callout-animated").props.style.height,
      ).toStrictEqual(TEST_PROPS.animatedStyle.height);
    });
  });
});
