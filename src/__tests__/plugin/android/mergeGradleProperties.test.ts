import { mergeGradleProperties } from "../../../plugin/android";

const PROPERTY = {
  type: "property",
  key: "exampleProperty",
  value: "value",
} as const;

const NEW_PROPERTY = {
  type: "property",
  key: "newProperty",
  value: "new",
} as const;

describe("Expo Plugin Android – mergeGradleProperties", () => {
  it("replaces duplicate property", () => {
    expect(
      mergeGradleProperties(
        [
          PROPERTY,
          {
            ...NEW_PROPERTY,
            value: "old",
          },
        ],
        [NEW_PROPERTY],
      ),
    ).toEqual([PROPERTY, NEW_PROPERTY]);
  });

  it("adds new property", () => {
    expect(mergeGradleProperties([PROPERTY], [NEW_PROPERTY])).toEqual([
      PROPERTY,
      NEW_PROPERTY,
    ]);
  });
});
