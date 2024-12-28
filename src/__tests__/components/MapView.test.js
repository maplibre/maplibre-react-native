import { render } from "@testing-library/react-native";
import * as React from "react";

import { MapView } from "../..";

describe("MapView", () => {
  test("renders with testID", () => {
    const expectedTestId = "im used for identification in tests";

    const { getByTestId } = render(<MapView testID={expectedTestId} />);

    expect(() => {
      getByTestId(expectedTestId);
    }).not.toThrow();
  });
});
