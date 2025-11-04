import { render } from "@testing-library/react-native";

import { MapView } from "../..";

const TEST_ID = "MLRNMapView";

describe("MapView", () => {
  test("renders with testID", () => {
    const { getByTestId } = render(<MapView testID={TEST_ID} />);

    expect(getByTestId(TEST_ID)).toBeDefined();
  });

  test("renders with light prop", () => {
    const lightStyle = {
      position: [1.5, 90, 80],
      color: "#ffffff",
      intensity: 0.5,
    };

    const { getByTestId } = render(
      <MapView testID={TEST_ID} light={lightStyle} />
    );

    expect(getByTestId(TEST_ID)).toBeDefined();
  });
});
