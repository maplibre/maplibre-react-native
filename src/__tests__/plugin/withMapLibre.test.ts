import * as podfileFixtures from "./__fixtures__/Podfile";
import { applyCocoaPodsModifications } from "../../plugin/ios";

describe("applyCocoaPodsModifications", () => {
  it("adds blocks to a react native template podfile", () => {
    expect(
      applyCocoaPodsModifications(podfileFixtures.reactNativeTemplatePodfile),
    ).toMatchSnapshot();
  });

  it("adds blocks to a expo prebuild template podfile", () => {
    expect(
      applyCocoaPodsModifications(podfileFixtures.expoTemplatePodfile),
    ).toMatchSnapshot();
  });

  it("adds blocks to a expo prebuild template podfile with custom modifications", () => {
    expect(
      applyCocoaPodsModifications(podfileFixtures.customExpoTemplatePodfile),
    ).toMatchSnapshot();
  });

  it("fails to add blocks to a bare podfile", () => {
    expect(() =>
      applyCocoaPodsModifications(podfileFixtures.blankTemplatePodfile),
    ).toThrow("Failed to match");
    expect(() => applyCocoaPodsModifications("")).toThrow("Failed to match");
  });

  it("does not re add blocks to an applied template podfile", () => {
    const runOnce = applyCocoaPodsModifications(
      podfileFixtures.reactNativeTemplatePodfile,
    );

    expect(applyCocoaPodsModifications(runOnce)).toMatch(runOnce);
  });

  it("works after revisions to blocks", () => {
    const runOnce = applyCocoaPodsModifications(
      podfileFixtures.expoTemplateWithRevisions,
    );

    expect(runOnce).toMatchSnapshot();
  });
});
