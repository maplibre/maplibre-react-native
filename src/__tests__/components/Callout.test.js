import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import { Callout } from "../..";

describe("Callout", () => {
  test("renders with custom title", () => {
    const testTitle = "test title";
    const { getByText } = render(<Callout {...{ title: testTitle }} />);

    expect(getByText(testTitle)).toBeDefined();
  });

  describe("_renderDefaultCallout", () => {
    test("renders default children", () => {
      const { getByTestId } = render(<Callout />);

      expect(getByTestId("callout")).toBeDefined();
      expect(getByTestId("title")).toBeDefined();
      expect(getByTestId("container")).toBeDefined();
    });

    test("renders with custom styles", () => {
      const testProps = {
        style: { height: 1 },
        containerStyle: { height: 2 },
        contentStyle: { height: 3 },
        tipStyle: { height: 4 },
        textStyle: { height: 5 },
      };
      const { getByTestId } = render(<Callout {...testProps} />);

      const callout = getByTestId("callout");
      const container = getByTestId("container");
      const wrapper = getByTestId("wrapper");
      const tip = getByTestId("tip");
      const title = getByTestId("title");

      const calloutWrapperTestStyle = callout.props.style[0].height;
      const animatedViewTestStyle = container.props.style.height;
      const wrapperViewTestStyle = wrapper.props.style[1].height;
      const tipViewTestStyle = tip.props.style[1].height;
      const textTestStyle = title.props.style[1].height;

      expect(calloutWrapperTestStyle).toStrictEqual(
        testProps.containerStyle.height,
      );
      expect(animatedViewTestStyle).toStrictEqual(testProps.style.height);
      expect(wrapperViewTestStyle).toStrictEqual(testProps.contentStyle.height);
      expect(tipViewTestStyle).toStrictEqual(testProps.tipStyle.height);
      expect(textTestStyle).toStrictEqual(testProps.textStyle.height);
    });
  });

  describe("_renderCustomCallout", () => {
    test("renders custom children", () => {
      const { getByTestId, queryByTestId } = render(
        <Callout>
          <View testID="TestChild">Foo Bar</View>
        </Callout>,
      );

      expect(queryByTestId("title")).toBeNull();
      expect(getByTestId("TestChild")).toBeDefined();
    });

    test("renders with custom styles", () => {
      const testProps = {
        style: { width: 1 },
        containerStyle: { width: 2 },
      };
      const { getByTestId } = render(
        <Callout {...testProps}>
          <View>Foo Bar</View>
        </Callout>,
      );
      const callout = getByTestId("callout");
      const view = getByTestId("container");

      const calloutWrapperTestStyle = callout.props.style[0].width;
      const animatedViewTestStyle = view.props.style.width;

      expect(calloutWrapperTestStyle).toStrictEqual(
        testProps.containerStyle.width,
      );
      expect(animatedViewTestStyle).toStrictEqual(testProps.style.width);
    });
  });
});
