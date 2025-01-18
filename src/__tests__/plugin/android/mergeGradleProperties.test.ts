import {
  GRADLE_PROPERTIES_PREFIX,
  mergeGradleProperties,
} from "../../../plugin/android";

const OTHER_PROPERTY = {
  type: "property",
  key: `some.other.exampleProperty`,
  value: "example",
} as const;

const OLD_PROPERTY = {
  type: "property",
  key: `${GRADLE_PROPERTIES_PREFIX}exampleProperty`,
  value: "old",
} as const;

const NEW_PROPERTY = {
  type: "property",
  key: `${GRADLE_PROPERTIES_PREFIX}exampleProperty`,
  value: "new",
} as const;

describe("Expo Plugin Android – mergeGradleProperties", () => {
  it("adds new property", () => {
    expect(mergeGradleProperties([OTHER_PROPERTY], [NEW_PROPERTY])).toEqual([
      OTHER_PROPERTY,
      NEW_PROPERTY,
    ]);
  });

  it("removes obsolete property", () => {
    expect(mergeGradleProperties([OTHER_PROPERTY, OLD_PROPERTY], [])).toEqual([
      OTHER_PROPERTY,
    ]);
  });

  it("replaces property", () => {
    expect(
      mergeGradleProperties([OTHER_PROPERTY, OLD_PROPERTY], [NEW_PROPERTY]),
    ).toEqual([OTHER_PROPERTY, NEW_PROPERTY]);
  });
});
