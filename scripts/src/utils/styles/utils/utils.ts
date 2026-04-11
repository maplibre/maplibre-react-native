export function getLayerType(layer: any, platform: "android" | "ios") {
  const isIOS = platform === "ios";

  switch (layer.name) {
    case "fill":
      return isIOS ? "MLNFillStyleLayer" : "FillLayer";
    case "fill-extrusion":
      return isIOS ? "MLNFillExtrusionStyleLayer" : "FillExtrusionLayer";
    case "line":
      return isIOS ? "MLNLineStyleLayer" : "LineLayer";
    case "symbol":
      return isIOS ? "MLNSymbolStyleLayer" : "SymbolLayer";
    case "circle":
      return isIOS ? "MLNCircleStyleLayer" : "CircleLayer";
    case "background":
      return isIOS ? "MLNBackgroundStyleLayer" : "BackgroundLayer";
    case "raster":
      return isIOS ? "MLNRasterStyleLayer" : "RasterLayer";
    case "heatmap":
      return isIOS ? "MLNHeatmapStyleLayer" : "HeatmapLayer";
    case "hillshade":
      return isIOS ? "MLNHillshadeStyleLayer" : "HillshadeLayer";
    case "light":
      return isIOS ? "MLNLight" : "Light";
    default:
      throw new Error(
        `Is ${layer.name} a new layer? We should add support for it!`,
      );
  }
}
