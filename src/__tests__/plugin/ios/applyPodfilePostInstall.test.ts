import * as podfileFixtures from "./__fixtures__/Podfile";
import { applyPodfilePostInstall } from "../../../plugin/ios";

describe("Expo Plugin iOS – applyPodfileModifications", () => {
  it("adds blocks to a react native template podfile", () => {
    expect(
      applyPodfilePostInstall(podfileFixtures.reactNativeTemplatePodfile),
    ).toMatchSnapshot();
  });

  it("adds blocks to a expo prebuild template podfile", () => {
    expect(
      applyPodfilePostInstall(podfileFixtures.expoTemplatePodfile),
    ).toMatchSnapshot();
  });

  it("adds blocks to a expo prebuild template podfile with custom modifications", () => {
    expect(
      applyPodfilePostInstall(podfileFixtures.expoTemplatePodfileCustomized),
    ).toMatchSnapshot();
  });

  it("fails to add blocks to a bare podfile", () => {
    expect(() =>
      applyPodfilePostInstall(podfileFixtures.blankTemplatePodfile),
    ).toThrow("Failed to match");
    expect(() => applyPodfilePostInstall("")).toThrow("Failed to match");
  });

  it("does not re add blocks to an applied template podfile", () => {
    const runOnce = applyPodfilePostInstall(
      podfileFixtures.reactNativeTemplatePodfile,
    );

    expect(applyPodfilePostInstall(runOnce)).toMatch(runOnce);
  });

  it("works after revisions to blocks", () => {
    const runOnce = applyPodfilePostInstall(
      podfileFixtures.expoTemplateWithRevisions,
    );

    expect(runOnce).toMatchSnapshot();
  });
});
