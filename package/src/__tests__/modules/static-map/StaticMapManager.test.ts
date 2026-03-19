import { StaticMapImageManager } from "../../..";

import { mockNativeModules } from "@/__tests__/__mocks__/NativeModules.mock";
import type { StaticMapCreateOptions } from "@/modules/static-map/StaticMapManager";

describe("StaticMapImageManager", () => {
  describe("createImage", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call native module with options and return file URI", async () => {
      jest
        .spyOn(mockNativeModules.MLRNStaticMapModule, "createImage")
        .mockResolvedValue("file://test.png");

      const options: StaticMapCreateOptions = {
        center: [-74.12641, 40.797968],
        zoom: 12,
        bearing: 20,
        pitch: 30,
        mapStyle: "https://demotiles.maplibre.org/style.json",
        width: 128,
        height: 64,
        output: "file",
      };

      const uri = await StaticMapImageManager.createImage(options);

      expect(
        mockNativeModules.MLRNStaticMapModule.createImage,
      ).toHaveBeenCalledWith(options);
      expect(uri).toBe("file://test.png");
    });

    it("should convert JSON mapStyle to string before calling native module", async () => {
      jest
        .spyOn(mockNativeModules.MLRNStaticMapModule, "createImage")
        .mockResolvedValue("file://test.png");

      const styleObject = {
        version: 8,
        sources: {},
        layers: [],
      };

      const options: StaticMapCreateOptions = {
        center: [-74.12641, 40.797968],
        zoom: 12,
        mapStyle: styleObject,
        width: 128,
        height: 64,
        output: "file",
      };

      await StaticMapImageManager.createImage(options);

      expect(
        mockNativeModules.MLRNStaticMapModule.createImage,
      ).toHaveBeenCalledWith({
        center: [-74.12641, 40.797968],
        zoom: 12,
        mapStyle: JSON.stringify(styleObject),
        width: 128,
        height: 64,
        output: "file",
      });
    });
  });
});
