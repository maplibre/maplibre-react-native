import snapshotDiff from "snapshot-diff";

import * as podfileFixtures from "./__fixtures__/Podfile";
import { applyPodfilePostInstall } from "../../../plugin/ios";

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());

describe("Expo Plugin iOS – applyPodfilePostInstall", () => {
  it("adds blocks to a react native template podfile", () => {
    expect(
      snapshotDiff(
        podfileFixtures.reactNativeTemplatePodfile,
        applyPodfilePostInstall(podfileFixtures.reactNativeTemplatePodfile),
      ),
    ).toMatchSnapshot();
  });

  it("adds blocks to a expo prebuild template podfile", () => {
    expect(
      snapshotDiff(
        podfileFixtures.expoTemplatePodfile,
        applyPodfilePostInstall(podfileFixtures.expoTemplatePodfile),
      ),
    ).toMatchSnapshot();
  });

  it("does not re-add blocks to an applied template podfile", () => {
    const runOnce = applyPodfilePostInstall(
      podfileFixtures.expoTemplatePodfile,
    );

    expect(applyPodfilePostInstall(runOnce)).toBe(runOnce);
  });

  it("adds blocks to a expo prebuild template podfile with custom modifications", () => {
    expect(
      snapshotDiff(
        podfileFixtures.expoTemplatePodfileCustomized,
        applyPodfilePostInstall(podfileFixtures.expoTemplatePodfileCustomized),
      ),
    ).toMatchSnapshot();
  });

  it("fixes invalid revisions", () => {
    expect(
      snapshotDiff(
        podfileFixtures.expoTemplateWithRevisions,
        applyPodfilePostInstall(podfileFixtures.expoTemplateWithRevisions),
      ),
    ).toMatchSnapshot();
  });

  it("fails to add blocks to a blank podfile", () => {
    expect(() =>
      applyPodfilePostInstall(podfileFixtures.blankTemplatePodfile),
    ).toThrow("Failed to match");

    expect(() => applyPodfilePostInstall("")).toThrow("Failed to match");
  });
});
