import { featureCollection, point } from "@turf/helpers";

import {
  OfflineCreatePackOptions,
  type OfflineCreatePackInputOptions,
} from "../../../modules/offline/OfflineCreatePackOptions";

describe("OfflineCreatePackOptions", () => {
  const options: OfflineCreatePackInputOptions = {
    name: "test",
    styleURL: "https://demotiles.maplibre.org/tiles/tiles.json",
    bounds: [0, 1, 2, 3], // [west, south, east, north]
    minZoom: 1,
    maxZoom: 22,
    metadata: {
      customData: "hiking",
    },
  };

  it("should create valid options", () => {
    const actualOptions = new OfflineCreatePackOptions(options);
    expect(actualOptions.name).toEqual(options.name);
    expect(actualOptions.styleURL).toEqual(options.styleURL);

    // we expect a feature collection string
    // LngLatBounds [west, south, east, north] converts to ne=[east, north], sw=[west, south]
    const [west, south, east, north] = options.bounds;
    expect(actualOptions.bounds).toEqual(
      JSON.stringify(
        featureCollection([point([east, north]), point([west, south])]),
      ),
    );

    expect(actualOptions.minZoom).toEqual(options.minZoom);
    expect(actualOptions.maxZoom).toEqual(options.maxZoom);

    // we expect a json string with name and data keys (new metadata structure)
    expect(actualOptions.metadata).toEqual(
      JSON.stringify({
        name: options.name,
        data: options.metadata,
      }),
    );
  });

  it("should throw error without a styleURL", () => {
    const invalidOptions = { ...options, styleURL: undefined };
    verifyErrorThrown(
      invalidOptions as unknown as OfflineCreatePackInputOptions,
    );
  });

  it("should throw error without a name", () => {
    const invalidOptions = { ...options, name: undefined };
    verifyErrorThrown(
      invalidOptions as unknown as OfflineCreatePackInputOptions,
    );
  });

  it("should throw error without bounds", () => {
    const invalidOptions = { ...options, bounds: undefined };
    verifyErrorThrown(
      invalidOptions as unknown as OfflineCreatePackInputOptions,
    );
  });

  it("should throw error without options", () => {
    verifyErrorThrown(undefined as unknown as OfflineCreatePackInputOptions);
    verifyErrorThrown(null as unknown as OfflineCreatePackInputOptions);
    verifyErrorThrown({} as unknown as OfflineCreatePackInputOptions);
  });
});

function verifyErrorThrown(
  invalidOptions: OfflineCreatePackInputOptions,
): void {
  expect(() => new OfflineCreatePackOptions(invalidOptions)).toThrow();
}
