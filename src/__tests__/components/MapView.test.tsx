import { render } from "@testing-library/react-native";

import { MapView } from "../..";

const TEST_ID = "MLRNMapView";

describe("MapView", () => {
  test("renders with testID", () => {
    const { getByTestId } = render(<MapView testID={TEST_ID} />);

    expect(getByTestId(TEST_ID)).toBeDefined();
  });
});
