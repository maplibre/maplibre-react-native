import {
  convertToInternalStyle,
  mergeStyleProps,
} from "@/utils/convertStyleSpec";

describe("convertStyleSpec", () => {
  describe("convertToInternalStyle", () => {
    it("should convert kebab-case keys to camelCase", () => {
      const input = {
        "fill-color": "red",
        "fill-opacity": 0.5,
      };

      expect(convertToInternalStyle(input)).toEqual({
        fillColor: "red",
        fillOpacity: 0.5,
      });
    });

    it("should handle multi-word kebab-case keys", () => {
      const input = {
        "line-gap-width": 2,
        "fill-extrusion-height": 100,
        "text-halo-color": "#000",
      };

      expect(convertToInternalStyle(input)).toEqual({
        lineGapWidth: 2,
        fillExtrusionHeight: 100,
        textHaloColor: "#000",
      });
    });

    it("should preserve camelCase keys unchanged", () => {
      const input = {
        fillColor: "blue",
        lineWidth: 3,
      };

      expect(convertToInternalStyle(input)).toEqual({
        fillColor: "blue",
        lineWidth: 3,
      });
    });

    it("should return undefined for undefined input", () => {
      expect(convertToInternalStyle(undefined)).toBeUndefined();
    });

    it("should handle empty objects", () => {
      expect(convertToInternalStyle({})).toEqual({});
    });

    it("should preserve expression values", () => {
      const input = {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "elevation"],
          0,
          "blue",
          100,
          "red",
        ],
      };

      expect(convertToInternalStyle(input)).toEqual({
        fillColor: [
          "interpolate",
          ["linear"],
          ["get", "elevation"],
          0,
          "blue",
          100,
          "red",
        ],
      });
    });

    it("should handle keys without hyphens", () => {
      const input = {
        visibility: "visible",
      };

      expect(convertToInternalStyle(input)).toEqual({
        visibility: "visible",
      });
    });
  });

  describe("mergeStyleProps", () => {
    it("should merge paint and layout props", () => {
      const paint = { "fill-color": "red" };
      const layout = { visibility: "visible" };

      expect(mergeStyleProps(paint, layout, undefined)).toEqual({
        fillColor: "red",
        visibility: "visible",
      });
    });

    it("should give paint precedence over layout for same property", () => {
      const paint = { visibility: "none" };
      const layout = { visibility: "visible" };

      expect(mergeStyleProps(paint, layout, undefined)).toEqual({
        visibility: "none",
      });
    });

    it("should give paint/layout precedence over deprecated style", () => {
      const paint = { "fill-color": "red" };
      const layout = { visibility: "visible" };
      const style = {
        fillColor: "blue",
        fillOpacity: 0.5,
        visibility: "none" as const,
      };

      expect(mergeStyleProps(paint, layout, style)).toEqual({
        fillColor: "red",
        fillOpacity: 0.5,
        visibility: "visible",
      });
    });

    it("should return deprecated style when only style is provided", () => {
      const style = {
        fillColor: "green",
        fillOpacity: 0.7,
      };

      expect(mergeStyleProps(undefined, undefined, style)).toEqual({
        fillColor: "green",
        fillOpacity: 0.7,
      });
    });

    it("should return undefined when nothing is provided", () => {
      expect(mergeStyleProps(undefined, undefined, undefined)).toBeUndefined();
    });

    it("should handle paint only", () => {
      const paint = { "fill-color": "red", "fill-opacity": 0.5 };

      expect(mergeStyleProps(paint, undefined, undefined)).toEqual({
        fillColor: "red",
        fillOpacity: 0.5,
      });
    });

    it("should handle layout only", () => {
      const layout = { visibility: "visible", "symbol-placement": "line" };

      expect(mergeStyleProps(undefined, layout, undefined)).toEqual({
        visibility: "visible",
        symbolPlacement: "line",
      });
    });
  });
});
