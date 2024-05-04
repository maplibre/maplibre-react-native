// DO NOT MODIFY
// THIS FILE IS AUTOGENERATED

#import "RCTMGLStyle.h"
#import "RCTMGLStyleValue.h"
#import <React/RCTBridge.h>

@import MapLibre;

@interface RCTMGLStyle : NSObject

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) MLNStyle *style;

- (id)initWithMGLStyle:(MLNStyle*)mglStyle;

- (void)fillLayer:(MLNFillStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)lineLayer:(MLNLineStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)symbolLayer:(MLNSymbolStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)circleLayer:(MLNCircleStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)heatmapLayer:(MLNHeatmapStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)fillExtrusionLayer:(MLNFillExtrusionStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)rasterLayer:(MLNRasterStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)hillshadeLayer:(MLNHillshadeStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)backgroundLayer:(MLNBackgroundStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;
- (void)lightLayer:(MLNLight *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid;

- (void)setFillSortKey:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillStyleLayerVisibility:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillAntialias:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillOpacity:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillOpacityTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillColor:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillColorTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillOutlineColor:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillOutlineColorTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillTranslate:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillTranslateTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillTranslateAnchor:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillPattern:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillPatternTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineCap:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineJoin:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineMiterLimit:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineRoundLimit:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineSortKey:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineStyleLayerVisibility:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineOpacity:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineOpacityTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineColor:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineColorTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineTranslate:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineTranslateTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineTranslateAnchor:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineWidth:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineWidthTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineGapWidth:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineGapWidthTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineOffset:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineOffsetTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineBlur:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineBlurTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineDasharray:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineDasharrayTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLinePattern:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLinePatternTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setLineGradient:(MLNLineStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolPlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolSpacing:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolAvoidEdges:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolSortKey:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolZOrder:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconAllowOverlap:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconIgnorePlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconOptional:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconRotationAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconSize:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconTextFit:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconTextFitPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconImage:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconRotate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconKeepUpright:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconPitchAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextPitchAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextRotationAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextField:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextFont:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextSize:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextMaxWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextLineHeight:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextLetterSpacing:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextJustify:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextRadialOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextVariableAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextMaxAngle:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextWritingMode:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextRotate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextKeepUpright:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextTransform:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextAllowOverlap:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextIgnorePlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextOptional:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setSymbolStyleLayerVisibility:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconOpacity:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconOpacityTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloWidthTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloBlur:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconHaloBlurTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconTranslate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconTranslateTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIconTranslateAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextOpacity:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextOpacityTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloWidthTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloBlur:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextHaloBlurTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextTranslate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextTranslateTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setTextTranslateAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleSortKey:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStyleLayerVisibility:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleRadius:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleRadiusTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleColor:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleColorTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleBlur:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleBlurTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleOpacity:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleOpacityTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleTranslate:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleTranslateTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleTranslateAnchor:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCirclePitchScale:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCirclePitchAlignment:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeWidth:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeWidthTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeColor:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeColorTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeOpacity:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setCircleStrokeOpacityTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapStyleLayerVisibility:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapRadius:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapRadiusTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapWeight:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapIntensity:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapIntensityTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapColor:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapOpacity:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHeatmapOpacityTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionStyleLayerVisibility:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionOpacity:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionOpacityTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionColor:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionColorTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionTranslate:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionTranslateTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionTranslateAnchor:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionPattern:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionPatternTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionHeight:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionHeightTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionBase:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setFillExtrusionBaseTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterStyleLayerVisibility:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterOpacity:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterOpacityTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterHueRotate:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterHueRotateTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterBrightnessMin:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterBrightnessMinTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterBrightnessMax:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterBrightnessMaxTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterSaturation:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterSaturationTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterContrast:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterContrastTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterResampling:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setRasterFadeDuration:(MLNRasterStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeStyleLayerVisibility:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeIlluminationDirection:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeIlluminationAnchor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeExaggeration:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeExaggerationTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeShadowColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeShadowColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeHighlightColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeHighlightColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeAccentColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setHillshadeAccentColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundStyleLayerVisibility:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundColor:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundColorTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundPattern:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundPatternTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundOpacity:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setBackgroundOpacityTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setAnchor:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setPosition:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setPositionTransition:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setColor:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setColorTransition:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIntensity:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;
- (void)setIntensityTransition:(MLNLight *)layer withReactStyleValue:(RCTMGLStyleValue *)styleValue;


@end