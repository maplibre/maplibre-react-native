/* eslint-disable */
// DO NOT MODIFY
// This file is auto-generated from scripts/templates/styleMap.ts.ejs

import { isAndroid } from "./index";

export const StyleTypes = {
  Constant: "constant",
  Color: "color",
  Transition: "transition",
  Translation: "translation",
  Function: "function",
  Image: "image",
  Enum: "enum",
};

export function getStyleType(styleProp: keyof typeof styleExtras): string {
  if (!isAndroid() && styleExtras[styleProp]) {
    return styleExtras[styleProp].iosType;
  }

  if (styleMap[styleProp]) {
    return styleMap[styleProp];
  }

  throw new Error(`${styleProp} is not a valid MapLibre layer style`);
}

const styleMap = {
  fillSortKey: StyleTypes.Constant,
  fillAntialias: StyleTypes.Constant,
  fillOpacity: StyleTypes.Constant,
  fillOpacityTransition: StyleTypes.Transition,
  fillColor: StyleTypes.Color,
  fillColorTransition: StyleTypes.Transition,
  fillOutlineColor: StyleTypes.Color,
  fillOutlineColorTransition: StyleTypes.Transition,
  fillTranslate: StyleTypes.Translation,
  fillTranslateTransition: StyleTypes.Transition,
  fillTranslateAnchor: StyleTypes.Enum,
  fillPattern: StyleTypes.Image,
  fillPatternTransition: StyleTypes.Transition,

  lineCap: StyleTypes.Enum,
  lineJoin: StyleTypes.Enum,
  lineMiterLimit: StyleTypes.Constant,
  lineRoundLimit: StyleTypes.Constant,
  lineSortKey: StyleTypes.Constant,
  lineOpacity: StyleTypes.Constant,
  lineOpacityTransition: StyleTypes.Transition,
  lineColor: StyleTypes.Color,
  lineColorTransition: StyleTypes.Transition,
  lineTranslate: StyleTypes.Translation,
  lineTranslateTransition: StyleTypes.Transition,
  lineTranslateAnchor: StyleTypes.Enum,
  lineWidth: StyleTypes.Constant,
  lineWidthTransition: StyleTypes.Transition,
  lineGapWidth: StyleTypes.Constant,
  lineGapWidthTransition: StyleTypes.Transition,
  lineOffset: StyleTypes.Constant,
  lineOffsetTransition: StyleTypes.Transition,
  lineBlur: StyleTypes.Constant,
  lineBlurTransition: StyleTypes.Transition,
  lineDasharray: StyleTypes.Constant,
  lineDasharrayTransition: StyleTypes.Transition,
  linePattern: StyleTypes.Image,
  linePatternTransition: StyleTypes.Transition,
  lineGradient: StyleTypes.Color,

  symbolPlacement: StyleTypes.Enum,
  symbolSpacing: StyleTypes.Constant,
  symbolAvoidEdges: StyleTypes.Constant,
  symbolSortKey: StyleTypes.Constant,
  symbolZOrder: StyleTypes.Enum,
  iconAllowOverlap: StyleTypes.Constant,
  iconIgnorePlacement: StyleTypes.Constant,
  iconOptional: StyleTypes.Constant,
  iconRotationAlignment: StyleTypes.Enum,
  iconSize: StyleTypes.Constant,
  iconTextFit: StyleTypes.Enum,
  iconTextFitPadding: StyleTypes.Constant,
  iconImage: StyleTypes.Image,
  iconRotate: StyleTypes.Constant,
  iconPadding: StyleTypes.Constant,
  iconKeepUpright: StyleTypes.Constant,
  iconOffset: StyleTypes.Constant,
  iconAnchor: StyleTypes.Enum,
  iconPitchAlignment: StyleTypes.Enum,
  textPitchAlignment: StyleTypes.Enum,
  textRotationAlignment: StyleTypes.Enum,
  textField: StyleTypes.Constant,
  textFont: StyleTypes.Constant,
  textSize: StyleTypes.Constant,
  textMaxWidth: StyleTypes.Constant,
  textLineHeight: StyleTypes.Constant,
  textLetterSpacing: StyleTypes.Constant,
  textJustify: StyleTypes.Enum,
  textRadialOffset: StyleTypes.Constant,
  textVariableAnchor: StyleTypes.Constant,
  textAnchor: StyleTypes.Enum,
  textMaxAngle: StyleTypes.Constant,
  textWritingMode: StyleTypes.Constant,
  textRotate: StyleTypes.Constant,
  textPadding: StyleTypes.Constant,
  textKeepUpright: StyleTypes.Constant,
  textTransform: StyleTypes.Enum,
  textOffset: StyleTypes.Constant,
  textAllowOverlap: StyleTypes.Constant,
  textIgnorePlacement: StyleTypes.Constant,
  textOptional: StyleTypes.Constant,
  iconOpacity: StyleTypes.Constant,
  iconOpacityTransition: StyleTypes.Transition,
  iconColor: StyleTypes.Color,
  iconColorTransition: StyleTypes.Transition,
  iconHaloColor: StyleTypes.Color,
  iconHaloColorTransition: StyleTypes.Transition,
  iconHaloWidth: StyleTypes.Constant,
  iconHaloWidthTransition: StyleTypes.Transition,
  iconHaloBlur: StyleTypes.Constant,
  iconHaloBlurTransition: StyleTypes.Transition,
  iconTranslate: StyleTypes.Translation,
  iconTranslateTransition: StyleTypes.Transition,
  iconTranslateAnchor: StyleTypes.Enum,
  textOpacity: StyleTypes.Constant,
  textOpacityTransition: StyleTypes.Transition,
  textColor: StyleTypes.Color,
  textColorTransition: StyleTypes.Transition,
  textHaloColor: StyleTypes.Color,
  textHaloColorTransition: StyleTypes.Transition,
  textHaloWidth: StyleTypes.Constant,
  textHaloWidthTransition: StyleTypes.Transition,
  textHaloBlur: StyleTypes.Constant,
  textHaloBlurTransition: StyleTypes.Transition,
  textTranslate: StyleTypes.Translation,
  textTranslateTransition: StyleTypes.Transition,
  textTranslateAnchor: StyleTypes.Enum,

  circleSortKey: StyleTypes.Constant,
  circleRadius: StyleTypes.Constant,
  circleRadiusTransition: StyleTypes.Transition,
  circleColor: StyleTypes.Color,
  circleColorTransition: StyleTypes.Transition,
  circleBlur: StyleTypes.Constant,
  circleBlurTransition: StyleTypes.Transition,
  circleOpacity: StyleTypes.Constant,
  circleOpacityTransition: StyleTypes.Transition,
  circleTranslate: StyleTypes.Translation,
  circleTranslateTransition: StyleTypes.Transition,
  circleTranslateAnchor: StyleTypes.Enum,
  circlePitchScale: StyleTypes.Enum,
  circlePitchAlignment: StyleTypes.Enum,
  circleStrokeWidth: StyleTypes.Constant,
  circleStrokeWidthTransition: StyleTypes.Transition,
  circleStrokeColor: StyleTypes.Color,
  circleStrokeColorTransition: StyleTypes.Transition,
  circleStrokeOpacity: StyleTypes.Constant,
  circleStrokeOpacityTransition: StyleTypes.Transition,

  heatmapRadius: StyleTypes.Constant,
  heatmapRadiusTransition: StyleTypes.Transition,
  heatmapWeight: StyleTypes.Constant,
  heatmapIntensity: StyleTypes.Constant,
  heatmapIntensityTransition: StyleTypes.Transition,
  heatmapColor: StyleTypes.Color,
  heatmapOpacity: StyleTypes.Constant,
  heatmapOpacityTransition: StyleTypes.Transition,

  fillExtrusionOpacity: StyleTypes.Constant,
  fillExtrusionOpacityTransition: StyleTypes.Transition,
  fillExtrusionColor: StyleTypes.Color,
  fillExtrusionColorTransition: StyleTypes.Transition,
  fillExtrusionTranslate: StyleTypes.Translation,
  fillExtrusionTranslateTransition: StyleTypes.Transition,
  fillExtrusionTranslateAnchor: StyleTypes.Enum,
  fillExtrusionPattern: StyleTypes.Image,
  fillExtrusionPatternTransition: StyleTypes.Transition,
  fillExtrusionHeight: StyleTypes.Constant,
  fillExtrusionHeightTransition: StyleTypes.Transition,
  fillExtrusionBase: StyleTypes.Constant,
  fillExtrusionBaseTransition: StyleTypes.Transition,
  fillExtrusionVerticalGradient: StyleTypes.Constant,

  rasterOpacity: StyleTypes.Constant,
  rasterOpacityTransition: StyleTypes.Transition,
  rasterHueRotate: StyleTypes.Constant,
  rasterHueRotateTransition: StyleTypes.Transition,
  rasterBrightnessMin: StyleTypes.Constant,
  rasterBrightnessMinTransition: StyleTypes.Transition,
  rasterBrightnessMax: StyleTypes.Constant,
  rasterBrightnessMaxTransition: StyleTypes.Transition,
  rasterSaturation: StyleTypes.Constant,
  rasterSaturationTransition: StyleTypes.Transition,
  rasterContrast: StyleTypes.Constant,
  rasterContrastTransition: StyleTypes.Transition,
  rasterResampling: StyleTypes.Enum,
  rasterFadeDuration: StyleTypes.Constant,

  hillshadeIlluminationDirection: StyleTypes.Constant,
  hillshadeIlluminationAnchor: StyleTypes.Enum,
  hillshadeExaggeration: StyleTypes.Constant,
  hillshadeExaggerationTransition: StyleTypes.Transition,
  hillshadeShadowColor: StyleTypes.Color,
  hillshadeShadowColorTransition: StyleTypes.Transition,
  hillshadeHighlightColor: StyleTypes.Color,
  hillshadeHighlightColorTransition: StyleTypes.Transition,
  hillshadeAccentColor: StyleTypes.Color,
  hillshadeAccentColorTransition: StyleTypes.Transition,

  backgroundColor: StyleTypes.Color,
  backgroundColorTransition: StyleTypes.Transition,
  backgroundPattern: StyleTypes.Image,
  backgroundPatternTransition: StyleTypes.Transition,
  backgroundOpacity: StyleTypes.Constant,
  backgroundOpacityTransition: StyleTypes.Transition,

  anchor: StyleTypes.Enum,
  position: StyleTypes.Constant,
  positionTransition: StyleTypes.Transition,
  color: StyleTypes.Color,
  colorTransition: StyleTypes.Transition,
  intensity: StyleTypes.Constant,
  intensityTransition: StyleTypes.Transition,

  visibility: StyleTypes.Constant,
};

export const styleExtras = {
  // padding
  iconTextFitPadding: {
    iosType: "edgeinsets",
  },

  // offsets
  iconOffset: {
    iosType: "vector",
  },
  textOffset: {
    iosType: "vector",
  },
  lineOffset: {
    iosType: "vector",
  },

  // translates
  fillTranslate: {
    iosType: "vector",
  },
  lineTranslate: {
    iosType: "vector",
  },
  iconTranslate: {
    iosType: "vector",
  },
  textTranslate: {
    iosType: "vector",
  },
  circleTranslate: {
    iosType: "vector",
  },
  fillExtrusionTranslate: {
    iosType: "vector",
  },
};

export default styleMap;
