import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";

import { ResourceType } from "@/types/TransformRequest";
import { applyTransformRequest } from "@/utils/applyTransformRequest";

describe("applyTransformRequest", () => {
  const addApiKey = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}access_token=test-key`;
  };

  it("should transform sprite URL (string)", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
      sprite: "https://api.mapbox.com/sprites/v1/mapbox/streets-v11",
    };

    const result = applyTransformRequest(style, (url, resourceType) => {
      expect(resourceType).toBe(ResourceType.SpriteImage);
      return { url: addApiKey(url) };
    });

    expect(result.sprite).toBe(
      "https://api.mapbox.com/sprites/v1/mapbox/streets-v11?access_token=test-key",
    );
  });

  it("should transform sprite URLs (array)", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
      sprite: [
        { id: "default", url: "https://api.mapbox.com/sprites/default" },
        { id: "custom", url: "https://api.mapbox.com/sprites/custom" },
      ],
    };

    const result = applyTransformRequest(style, (url) => ({
      url: addApiKey(url),
    }));

    expect(result.sprite).toEqual([
      {
        id: "default",
        url: "https://api.mapbox.com/sprites/default?access_token=test-key",
      },
      {
        id: "custom",
        url: "https://api.mapbox.com/sprites/custom?access_token=test-key",
      },
    ]);
  });

  it("should transform glyphs URL", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
      glyphs: "https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf",
    };

    const result = applyTransformRequest(style, (url, resourceType) => {
      expect(resourceType).toBe(ResourceType.Glyphs);
      return { url: addApiKey(url) };
    });

    expect(result.glyphs).toBe(
      "https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf?access_token=test-key",
    );
  });

  it("should transform source URL (TileJSON)", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {
        mapbox: {
          type: "vector",
          url: "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8.json",
        },
      },
      layers: [],
    };

    const result = applyTransformRequest(style, (url, resourceType) => {
      if (resourceType === ResourceType.Source) {
        return { url: addApiKey(url) };
      }
    });

    expect((result.sources.mapbox as { url: string }).url).toBe(
      "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8.json?access_token=test-key",
    );
  });

  it("should transform source tiles URLs", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {
        mapbox: {
          type: "vector",
          tiles: [
            "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf",
          ],
        },
      },
      layers: [],
    };

    const result = applyTransformRequest(style, (url, resourceType) => {
      if (resourceType === ResourceType.Tile) {
        return { url: addApiKey(url) };
      }
    });

    expect((result.sources.mapbox as { tiles: string[] }).tiles).toEqual([
      "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=test-key",
    ]);
  });

  it("should not transform URLs when returning undefined", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
      sprite: "https://example.com/sprites",
      glyphs: "https://example.com/fonts/{fontstack}/{range}.pbf",
    };

    const result = applyTransformRequest(style, () => undefined);

    expect(result.sprite).toBe("https://example.com/sprites");
    expect(result.glyphs).toBe(
      "https://example.com/fonts/{fontstack}/{range}.pbf",
    );
  });

  it("should only transform matching URLs", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {
        mapbox: {
          type: "vector",
          url: "https://api.mapbox.com/source.json",
        },
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        },
      },
      layers: [],
      sprite: "https://api.mapbox.com/sprites",
    };

    const result = applyTransformRequest(style, (url) => {
      if (url.includes("mapbox.com")) {
        return { url: addApiKey(url) };
      }
    });

    expect(result.sprite).toBe(
      "https://api.mapbox.com/sprites?access_token=test-key",
    );
    expect((result.sources.mapbox as { url: string }).url).toBe(
      "https://api.mapbox.com/source.json?access_token=test-key",
    );
    expect((result.sources.osm as { tiles: string[] }).tiles[0]).toBe(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    );
  });

  it("should not mutate the original style", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
      sprite: "https://example.com/sprites",
    };

    const originalSprite = style.sprite;

    applyTransformRequest(style, (url) => ({
      url: `${url}?modified=true`,
    }));

    expect(style.sprite).toBe(originalSprite);
  });

  it("should handle style with no transformable URLs", () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {
        geojson: {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        },
      },
      layers: [],
    };

    const result = applyTransformRequest(style, (url) => ({
      url: `${url}?modified=true`,
    }));

    expect(result).toEqual(style);
  });
});
