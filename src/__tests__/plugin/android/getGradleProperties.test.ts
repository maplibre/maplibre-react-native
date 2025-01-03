import { getGradleProperties } from "../../../plugin/android";

describe("Expo Plugin Android – getGradleProperties", () => {
  it("removes empty property keys", () => {
    const result = getGradleProperties({
      android: {
        // @ts-expect-error
        "": "default",
      },
    });

    expect(result).toEqual([]);
  });

  it("removes empty property values", () => {
    const result = getGradleProperties({
      android: {
        // @ts-expect-error
        locationEngine: "",
      },
    });

    expect(result).toEqual([]);
  });

  it("adds valid properties", () => {
    const result = getGradleProperties({
      android: {
        locationEngine: "google",
      },
    });

    expect(result).toEqual([
      {
        type: "property",
        key: "org.maplibre.reactnative.locationEngine",
        value: "google",
      },
    ]);
  });
});
