import { snapshotManager } from "../../../src";

describe("snapshotManager", () => {
  it("should resolve uri", async () => {
    const options = { centerCoordinate: [1, 2] };
    const uri = await snapshotManager.takeSnap(options);
    expect(uri).toEqual("file://test.png");
  });
});
