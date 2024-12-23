import { SnapshotManager } from "../../..";

describe("SnapshotManager", () => {
  it("should resolve uri", async () => {
    const options = { centerCoordinate: [1, 2] };
    const uri = await SnapshotManager.takeSnap(options);
    expect(uri).toEqual("file://test.png");
  });
});
