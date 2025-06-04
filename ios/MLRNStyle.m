// DO NOT MODIFY
// This file is auto-generated from scripts/templates/MLRNStyle.m.ejs

#import "MLRNStyle.h"
#import "MLRNUtils.h"

@implementation MLRNStyle

- (id)initWithMLNStyle:(MLNStyle*)mlnStyle
{
    if (self = [super init]) {
        _style = mlnStyle;
    }
    return self;
}


- (void)fillLayer:(MLNFillStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"fillSortKey"]) {
      [self setFillSortKey:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"visibility"]) {
      [self setFillStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillAntialias"]) {
      [self setFillAntialias:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillOpacity"]) {
      [self setFillOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillOpacityTransition"]) {
      [self setFillOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillColor"]) {
      [self setFillColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillColorTransition"]) {
      [self setFillColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillOutlineColor"]) {
      [self setFillOutlineColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillOutlineColorTransition"]) {
      [self setFillOutlineColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillTranslate"]) {
      [self setFillTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillTranslateTransition"]) {
      [self setFillTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillTranslateAnchor"]) {
      [self setFillTranslateAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillPattern"]) {
      if (![styleValue shouldAddImage]) {
        [self setFillPattern:layer withReactStyleValue:styleValue];
      } else {
        NSString *imageURI = [styleValue getImageURI];

        [MLRNUtils fetchImage:_bridge url:imageURI scale:[styleValue getImageScale] callback:^(NSError *error, UIImage *image) {
          if (image != nil) {
            dispatch_async(dispatch_get_main_queue(), ^{
              if (isValid()) {
                [self->_style setImage:image forName:imageURI];
                [self setFillPattern:layer withReactStyleValue:styleValue];
              }
            });
          }
        }];
      }
    } else if ([prop isEqualToString:@"fillPatternTransition"]) {
      [self setFillPatternTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)lineLayer:(MLNLineStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"lineCap"]) {
      [self setLineCap:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineJoin"]) {
      [self setLineJoin:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineMiterLimit"]) {
      [self setLineMiterLimit:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineRoundLimit"]) {
      [self setLineRoundLimit:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineSortKey"]) {
      [self setLineSortKey:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"visibility"]) {
      [self setLineStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineOpacity"]) {
      [self setLineOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineOpacityTransition"]) {
      [self setLineOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineColor"]) {
      [self setLineColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineColorTransition"]) {
      [self setLineColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineTranslate"]) {
      [self setLineTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineTranslateTransition"]) {
      [self setLineTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineTranslateAnchor"]) {
      [self setLineTranslateAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineWidth"]) {
      [self setLineWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineWidthTransition"]) {
      [self setLineWidthTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineGapWidth"]) {
      [self setLineGapWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineGapWidthTransition"]) {
      [self setLineGapWidthTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineOffset"]) {
      [self setLineOffset:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineOffsetTransition"]) {
      [self setLineOffsetTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineBlur"]) {
      [self setLineBlur:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineBlurTransition"]) {
      [self setLineBlurTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineDasharray"]) {
      [self setLineDasharray:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineDasharrayTransition"]) {
      [self setLineDasharrayTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"linePattern"]) {
      if (![styleValue shouldAddImage]) {
        [self setLinePattern:layer withReactStyleValue:styleValue];
      } else {
        NSString *imageURI = [styleValue getImageURI];

        [MLRNUtils fetchImage:_bridge url:imageURI scale:[styleValue getImageScale] callback:^(NSError *error, UIImage *image) {
          if (image != nil) {
            dispatch_async(dispatch_get_main_queue(), ^{
              if (isValid()) {
                [self->_style setImage:image forName:imageURI];
                [self setLinePattern:layer withReactStyleValue:styleValue];
              }
            });
          }
        }];
      }
    } else if ([prop isEqualToString:@"linePatternTransition"]) {
      [self setLinePatternTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"lineGradient"]) {
      [self setLineGradient:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)symbolLayer:(MLNSymbolStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"symbolPlacement"]) {
      [self setSymbolPlacement:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"symbolSpacing"]) {
      [self setSymbolSpacing:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"symbolAvoidEdges"]) {
      [self setSymbolAvoidEdges:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"symbolSortKey"]) {
      [self setSymbolSortKey:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"symbolZOrder"]) {
      [self setSymbolZOrder:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconAllowOverlap"]) {
      [self setIconAllowOverlap:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconIgnorePlacement"]) {
      [self setIconIgnorePlacement:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconOptional"]) {
      [self setIconOptional:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconRotationAlignment"]) {
      [self setIconRotationAlignment:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconSize"]) {
      [self setIconSize:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconTextFit"]) {
      [self setIconTextFit:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconTextFitPadding"]) {
      [self setIconTextFitPadding:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconImage"]) {
      if (![styleValue shouldAddImage]) {
        [self setIconImage:layer withReactStyleValue:styleValue];
      } else {
        NSString *imageURI = [styleValue getImageURI];

        [MLRNUtils fetchImage:_bridge url:imageURI scale:[styleValue getImageScale] callback:^(NSError *error, UIImage *image) {
          if (image != nil) {
            dispatch_async(dispatch_get_main_queue(), ^{
              if (isValid()) {
                [self->_style setImage:image forName:imageURI];
                [self setIconImage:layer withReactStyleValue:styleValue];
              }
            });
          }
        }];
      }
    } else if ([prop isEqualToString:@"iconRotate"]) {
      [self setIconRotate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconPadding"]) {
      [self setIconPadding:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconKeepUpright"]) {
      [self setIconKeepUpright:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconOffset"]) {
      [self setIconOffset:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconAnchor"]) {
      [self setIconAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconPitchAlignment"]) {
      [self setIconPitchAlignment:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textPitchAlignment"]) {
      [self setTextPitchAlignment:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textRotationAlignment"]) {
      [self setTextRotationAlignment:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textField"]) {
      [self setTextField:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textFont"]) {
      [self setTextFont:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textSize"]) {
      [self setTextSize:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textMaxWidth"]) {
      [self setTextMaxWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textLineHeight"]) {
      [self setTextLineHeight:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textLetterSpacing"]) {
      [self setTextLetterSpacing:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textJustify"]) {
      [self setTextJustify:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textRadialOffset"]) {
      [self setTextRadialOffset:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textVariableAnchor"]) {
      [self setTextVariableAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textAnchor"]) {
      [self setTextAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textMaxAngle"]) {
      [self setTextMaxAngle:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textWritingMode"]) {
      [self setTextWritingMode:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textRotate"]) {
      [self setTextRotate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textPadding"]) {
      [self setTextPadding:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textKeepUpright"]) {
      [self setTextKeepUpright:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textTransform"]) {
      [self setTextTransform:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textOffset"]) {
      [self setTextOffset:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textAllowOverlap"]) {
      [self setTextAllowOverlap:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textIgnorePlacement"]) {
      [self setTextIgnorePlacement:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textOptional"]) {
      [self setTextOptional:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"visibility"]) {
      [self setSymbolStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconOpacity"]) {
      [self setIconOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconOpacityTransition"]) {
      [self setIconOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconColor"]) {
      [self setIconColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconColorTransition"]) {
      [self setIconColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloColor"]) {
      [self setIconHaloColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloColorTransition"]) {
      [self setIconHaloColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloWidth"]) {
      [self setIconHaloWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloWidthTransition"]) {
      [self setIconHaloWidthTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloBlur"]) {
      [self setIconHaloBlur:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconHaloBlurTransition"]) {
      [self setIconHaloBlurTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconTranslate"]) {
      [self setIconTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconTranslateTransition"]) {
      [self setIconTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"iconTranslateAnchor"]) {
      [self setIconTranslateAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textOpacity"]) {
      [self setTextOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textOpacityTransition"]) {
      [self setTextOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textColor"]) {
      [self setTextColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textColorTransition"]) {
      [self setTextColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloColor"]) {
      [self setTextHaloColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloColorTransition"]) {
      [self setTextHaloColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloWidth"]) {
      [self setTextHaloWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloWidthTransition"]) {
      [self setTextHaloWidthTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloBlur"]) {
      [self setTextHaloBlur:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textHaloBlurTransition"]) {
      [self setTextHaloBlurTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textTranslate"]) {
      [self setTextTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textTranslateTransition"]) {
      [self setTextTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"textTranslateAnchor"]) {
      [self setTextTranslateAnchor:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)circleLayer:(MLNCircleStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"circleSortKey"]) {
      [self setCircleSortKey:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"visibility"]) {
      [self setCircleStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleRadius"]) {
      [self setCircleRadius:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleRadiusTransition"]) {
      [self setCircleRadiusTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleColor"]) {
      [self setCircleColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleColorTransition"]) {
      [self setCircleColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleBlur"]) {
      [self setCircleBlur:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleBlurTransition"]) {
      [self setCircleBlurTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleOpacity"]) {
      [self setCircleOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleOpacityTransition"]) {
      [self setCircleOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleTranslate"]) {
      [self setCircleTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleTranslateTransition"]) {
      [self setCircleTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleTranslateAnchor"]) {
      [self setCircleTranslateAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circlePitchScale"]) {
      [self setCirclePitchScale:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circlePitchAlignment"]) {
      [self setCirclePitchAlignment:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeWidth"]) {
      [self setCircleStrokeWidth:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeWidthTransition"]) {
      [self setCircleStrokeWidthTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeColor"]) {
      [self setCircleStrokeColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeColorTransition"]) {
      [self setCircleStrokeColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeOpacity"]) {
      [self setCircleStrokeOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"circleStrokeOpacityTransition"]) {
      [self setCircleStrokeOpacityTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)heatmapLayer:(MLNHeatmapStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"visibility"]) {
      [self setHeatmapStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapRadius"]) {
      [self setHeatmapRadius:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapRadiusTransition"]) {
      [self setHeatmapRadiusTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapWeight"]) {
      [self setHeatmapWeight:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapIntensity"]) {
      [self setHeatmapIntensity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapIntensityTransition"]) {
      [self setHeatmapIntensityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapColor"]) {
      [self setHeatmapColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapOpacity"]) {
      [self setHeatmapOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"heatmapOpacityTransition"]) {
      [self setHeatmapOpacityTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)fillExtrusionLayer:(MLNFillExtrusionStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"visibility"]) {
      [self setFillExtrusionStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionOpacity"]) {
      [self setFillExtrusionOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionOpacityTransition"]) {
      [self setFillExtrusionOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionColor"]) {
      [self setFillExtrusionColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionColorTransition"]) {
      [self setFillExtrusionColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionTranslate"]) {
      [self setFillExtrusionTranslate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionTranslateTransition"]) {
      [self setFillExtrusionTranslateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionTranslateAnchor"]) {
      [self setFillExtrusionTranslateAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionPattern"]) {
      if (![styleValue shouldAddImage]) {
        [self setFillExtrusionPattern:layer withReactStyleValue:styleValue];
      } else {
        NSString *imageURI = [styleValue getImageURI];

        [MLRNUtils fetchImage:_bridge url:imageURI scale:[styleValue getImageScale] callback:^(NSError *error, UIImage *image) {
          if (image != nil) {
            dispatch_async(dispatch_get_main_queue(), ^{
              if (isValid()) {
                [self->_style setImage:image forName:imageURI];
                [self setFillExtrusionPattern:layer withReactStyleValue:styleValue];
              }
            });
          }
        }];
      }
    } else if ([prop isEqualToString:@"fillExtrusionPatternTransition"]) {
      [self setFillExtrusionPatternTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionHeight"]) {
      [self setFillExtrusionHeight:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionHeightTransition"]) {
      [self setFillExtrusionHeightTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionBase"]) {
      [self setFillExtrusionBase:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionBaseTransition"]) {
      [self setFillExtrusionBaseTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"fillExtrusionVerticalGradient"]) {
      [self setFillExtrusionVerticalGradient:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)rasterLayer:(MLNRasterStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"visibility"]) {
      [self setRasterStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterOpacity"]) {
      [self setRasterOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterOpacityTransition"]) {
      [self setRasterOpacityTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterHueRotate"]) {
      [self setRasterHueRotate:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterHueRotateTransition"]) {
      [self setRasterHueRotateTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterBrightnessMin"]) {
      [self setRasterBrightnessMin:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterBrightnessMinTransition"]) {
      [self setRasterBrightnessMinTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterBrightnessMax"]) {
      [self setRasterBrightnessMax:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterBrightnessMaxTransition"]) {
      [self setRasterBrightnessMaxTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterSaturation"]) {
      [self setRasterSaturation:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterSaturationTransition"]) {
      [self setRasterSaturationTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterContrast"]) {
      [self setRasterContrast:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterContrastTransition"]) {
      [self setRasterContrastTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterResampling"]) {
      [self setRasterResampling:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"rasterFadeDuration"]) {
      [self setRasterFadeDuration:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)hillshadeLayer:(MLNHillshadeStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"visibility"]) {
      [self setHillshadeStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeIlluminationDirection"]) {
      [self setHillshadeIlluminationDirection:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeIlluminationAnchor"]) {
      [self setHillshadeIlluminationAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeExaggeration"]) {
      [self setHillshadeExaggeration:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeExaggerationTransition"]) {
      [self setHillshadeExaggerationTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeShadowColor"]) {
      [self setHillshadeShadowColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeShadowColorTransition"]) {
      [self setHillshadeShadowColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeHighlightColor"]) {
      [self setHillshadeHighlightColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeHighlightColorTransition"]) {
      [self setHillshadeHighlightColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeAccentColor"]) {
      [self setHillshadeAccentColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"hillshadeAccentColorTransition"]) {
      [self setHillshadeAccentColorTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)backgroundLayer:(MLNBackgroundStyleLayer *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"visibility"]) {
      [self setBackgroundStyleLayerVisibility:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"backgroundColor"]) {
      [self setBackgroundColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"backgroundColorTransition"]) {
      [self setBackgroundColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"backgroundPattern"]) {
      if (![styleValue shouldAddImage]) {
        [self setBackgroundPattern:layer withReactStyleValue:styleValue];
      } else {
        NSString *imageURI = [styleValue getImageURI];

        [MLRNUtils fetchImage:_bridge url:imageURI scale:[styleValue getImageScale] callback:^(NSError *error, UIImage *image) {
          if (image != nil) {
            dispatch_async(dispatch_get_main_queue(), ^{
              if (isValid()) {
                [self->_style setImage:image forName:imageURI];
                [self setBackgroundPattern:layer withReactStyleValue:styleValue];
              }
            });
          }
        }];
      }
    } else if ([prop isEqualToString:@"backgroundPatternTransition"]) {
      [self setBackgroundPatternTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"backgroundOpacity"]) {
      [self setBackgroundOpacity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"backgroundOpacityTransition"]) {
      [self setBackgroundOpacityTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}

- (void)lightLayer:(MLNLight *)layer withReactStyle:(NSDictionary *)reactStyle isValid:(BOOL (^)(void)) isValid
{
  if (![self _hasReactStyle:reactStyle]) {
    // TODO throw exception
    return;
  }

  NSArray<NSString*> *styleProps = [reactStyle allKeys];
  for (NSString *prop in styleProps) {
    MLRNStyleValue *styleValue = [MLRNStyleValue make:reactStyle[prop]];

    if ([prop isEqualToString:@"anchor"]) {
      [self setAnchor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"position"]) {
      [self setPosition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"positionTransition"]) {
      [self setPositionTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"color"]) {
      [self setColor:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"colorTransition"]) {
      [self setColorTransition:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"intensity"]) {
      [self setIntensity:layer withReactStyleValue:styleValue];
    } else if ([prop isEqualToString:@"intensityTransition"]) {
      [self setIntensityTransition:layer withReactStyleValue:styleValue];
    } else {
      // TODO throw exception
    }
  }
}




- (void)setFillSortKey:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillSortKey = styleValue.mlnStyleValue;
}

- (void)setFillStyleLayerVisibility:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setFillAntialias:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillAntialiased = styleValue.mlnStyleValue;
}

- (void)setFillOpacity:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillOpacity = styleValue.mlnStyleValue;
}

- (void)setFillOpacityTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillOpacityTransition = [styleValue getTransition];
}

- (void)setFillColor:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillColor = styleValue.mlnStyleValue;
}

- (void)setFillColorTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillColorTransition = [styleValue getTransition];
}

- (void)setFillOutlineColor:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillOutlineColor = styleValue.mlnStyleValue;
}

- (void)setFillOutlineColorTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillOutlineColorTransition = [styleValue getTransition];
}

- (void)setFillTranslate:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillTranslation = styleValue.mlnStyleValue;
}

- (void)setFillTranslateTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillTranslationTransition = [styleValue getTransition];
}

- (void)setFillTranslateAnchor:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillTranslationAnchor = styleValue.mlnStyleValue;
}

- (void)setFillPattern:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillPattern = styleValue.mlnStyleValue;
}

- (void)setFillPatternTransition:(MLNFillStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillPatternTransition = [styleValue getTransition];
}



- (void)setLineCap:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineCap = styleValue.mlnStyleValue;
}

- (void)setLineJoin:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineJoin = styleValue.mlnStyleValue;
}

- (void)setLineMiterLimit:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineMiterLimit = styleValue.mlnStyleValue;
}

- (void)setLineRoundLimit:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineRoundLimit = styleValue.mlnStyleValue;
}

- (void)setLineSortKey:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineSortKey = styleValue.mlnStyleValue;
}

- (void)setLineStyleLayerVisibility:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setLineOpacity:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineOpacity = styleValue.mlnStyleValue;
}

- (void)setLineOpacityTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineOpacityTransition = [styleValue getTransition];
}

- (void)setLineColor:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineColor = styleValue.mlnStyleValue;
}

- (void)setLineColorTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineColorTransition = [styleValue getTransition];
}

- (void)setLineTranslate:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineTranslation = styleValue.mlnStyleValue;
}

- (void)setLineTranslateTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineTranslationTransition = [styleValue getTransition];
}

- (void)setLineTranslateAnchor:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineTranslationAnchor = styleValue.mlnStyleValue;
}

- (void)setLineWidth:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineWidth = styleValue.mlnStyleValue;
}

- (void)setLineWidthTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineWidthTransition = [styleValue getTransition];
}

- (void)setLineGapWidth:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineGapWidth = styleValue.mlnStyleValue;
}

- (void)setLineGapWidthTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineGapWidthTransition = [styleValue getTransition];
}

- (void)setLineOffset:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineOffset = styleValue.mlnStyleValue;
}

- (void)setLineOffsetTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineOffsetTransition = [styleValue getTransition];
}

- (void)setLineBlur:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineBlur = styleValue.mlnStyleValue;
}

- (void)setLineBlurTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineBlurTransition = [styleValue getTransition];
}

- (void)setLineDasharray:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineDashPattern = styleValue.mlnStyleValue;
}

- (void)setLineDasharrayTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineDashPatternTransition = [styleValue getTransition];
}

- (void)setLinePattern:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.linePattern = styleValue.mlnStyleValue;
}

- (void)setLinePatternTransition:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.linePatternTransition = [styleValue getTransition];
}

- (void)setLineGradient:(MLNLineStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.lineGradient = styleValue.mlnStyleValue;
}



- (void)setSymbolPlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.symbolPlacement = styleValue.mlnStyleValue;
}

- (void)setSymbolSpacing:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.symbolSpacing = styleValue.mlnStyleValue;
}

- (void)setSymbolAvoidEdges:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.symbolAvoidsEdges = styleValue.mlnStyleValue;
}

- (void)setSymbolSortKey:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.symbolSortKey = styleValue.mlnStyleValue;
}

- (void)setSymbolZOrder:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.symbolZOrder = styleValue.mlnStyleValue;
}

- (void)setIconAllowOverlap:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconAllowsOverlap = styleValue.mlnStyleValue;
}

- (void)setIconIgnorePlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconIgnoresPlacement = styleValue.mlnStyleValue;
}

- (void)setIconOptional:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconOptional = styleValue.mlnStyleValue;
}

- (void)setIconRotationAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconRotationAlignment = styleValue.mlnStyleValue;
}

- (void)setIconSize:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconScale = styleValue.mlnStyleValue;
}

- (void)setIconTextFit:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconTextFit = styleValue.mlnStyleValue;
}

- (void)setIconTextFitPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconTextFitPadding = styleValue.mlnStyleValue;
}

- (void)setIconImage:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconImageName = styleValue.mlnStyleValue;
}

- (void)setIconRotate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconRotation = styleValue.mlnStyleValue;
}

- (void)setIconPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconPadding = styleValue.mlnStyleValue;
}

- (void)setIconKeepUpright:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.keepsIconUpright = styleValue.mlnStyleValue;
}

- (void)setIconOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconOffset = styleValue.mlnStyleValue;
}

- (void)setIconAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconAnchor = styleValue.mlnStyleValue;
}

- (void)setIconPitchAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconPitchAlignment = styleValue.mlnStyleValue;
}

- (void)setTextPitchAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textPitchAlignment = styleValue.mlnStyleValue;
}

- (void)setTextRotationAlignment:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textRotationAlignment = styleValue.mlnStyleValue;
}

- (void)setTextField:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.text = styleValue.mlnStyleValue;
}

- (void)setTextFont:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textFontNames = styleValue.mlnStyleValue;
}

- (void)setTextSize:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textFontSize = styleValue.mlnStyleValue;
}

- (void)setTextMaxWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.maximumTextWidth = styleValue.mlnStyleValue;
}

- (void)setTextLineHeight:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textLineHeight = styleValue.mlnStyleValue;
}

- (void)setTextLetterSpacing:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textLetterSpacing = styleValue.mlnStyleValue;
}

- (void)setTextJustify:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textJustification = styleValue.mlnStyleValue;
}

- (void)setTextRadialOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textRadialOffset = styleValue.mlnStyleValue;
}

- (void)setTextVariableAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textVariableAnchor = styleValue.mlnStyleValue;
}

- (void)setTextAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textAnchor = styleValue.mlnStyleValue;
}

- (void)setTextMaxAngle:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.maximumTextAngle = styleValue.mlnStyleValue;
}

- (void)setTextWritingMode:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textWritingModes = styleValue.mlnStyleValue;
}

- (void)setTextRotate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textRotation = styleValue.mlnStyleValue;
}

- (void)setTextPadding:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textPadding = styleValue.mlnStyleValue;
}

- (void)setTextKeepUpright:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.keepsTextUpright = styleValue.mlnStyleValue;
}

- (void)setTextTransform:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textTransform = styleValue.mlnStyleValue;
}

- (void)setTextOffset:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textOffset = styleValue.mlnStyleValue;
}

- (void)setTextAllowOverlap:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textAllowsOverlap = styleValue.mlnStyleValue;
}

- (void)setTextIgnorePlacement:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textIgnoresPlacement = styleValue.mlnStyleValue;
}

- (void)setTextOptional:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textOptional = styleValue.mlnStyleValue;
}

- (void)setSymbolStyleLayerVisibility:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setIconOpacity:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconOpacity = styleValue.mlnStyleValue;
}

- (void)setIconOpacityTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconOpacityTransition = [styleValue getTransition];
}

- (void)setIconColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconColor = styleValue.mlnStyleValue;
}

- (void)setIconColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconColorTransition = [styleValue getTransition];
}

- (void)setIconHaloColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloColor = styleValue.mlnStyleValue;
}

- (void)setIconHaloColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloColorTransition = [styleValue getTransition];
}

- (void)setIconHaloWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloWidth = styleValue.mlnStyleValue;
}

- (void)setIconHaloWidthTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloWidthTransition = [styleValue getTransition];
}

- (void)setIconHaloBlur:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloBlur = styleValue.mlnStyleValue;
}

- (void)setIconHaloBlurTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconHaloBlurTransition = [styleValue getTransition];
}

- (void)setIconTranslate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconTranslation = styleValue.mlnStyleValue;
}

- (void)setIconTranslateTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconTranslationTransition = [styleValue getTransition];
}

- (void)setIconTranslateAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.iconTranslationAnchor = styleValue.mlnStyleValue;
}

- (void)setTextOpacity:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textOpacity = styleValue.mlnStyleValue;
}

- (void)setTextOpacityTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textOpacityTransition = [styleValue getTransition];
}

- (void)setTextColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textColor = styleValue.mlnStyleValue;
}

- (void)setTextColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textColorTransition = [styleValue getTransition];
}

- (void)setTextHaloColor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloColor = styleValue.mlnStyleValue;
}

- (void)setTextHaloColorTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloColorTransition = [styleValue getTransition];
}

- (void)setTextHaloWidth:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloWidth = styleValue.mlnStyleValue;
}

- (void)setTextHaloWidthTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloWidthTransition = [styleValue getTransition];
}

- (void)setTextHaloBlur:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloBlur = styleValue.mlnStyleValue;
}

- (void)setTextHaloBlurTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textHaloBlurTransition = [styleValue getTransition];
}

- (void)setTextTranslate:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textTranslation = styleValue.mlnStyleValue;
}

- (void)setTextTranslateTransition:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textTranslationTransition = [styleValue getTransition];
}

- (void)setTextTranslateAnchor:(MLNSymbolStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.textTranslationAnchor = styleValue.mlnStyleValue;
}



- (void)setCircleSortKey:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleSortKey = styleValue.mlnStyleValue;
}

- (void)setCircleStyleLayerVisibility:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setCircleRadius:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleRadius = styleValue.mlnStyleValue;
}

- (void)setCircleRadiusTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleRadiusTransition = [styleValue getTransition];
}

- (void)setCircleColor:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleColor = styleValue.mlnStyleValue;
}

- (void)setCircleColorTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleColorTransition = [styleValue getTransition];
}

- (void)setCircleBlur:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleBlur = styleValue.mlnStyleValue;
}

- (void)setCircleBlurTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleBlurTransition = [styleValue getTransition];
}

- (void)setCircleOpacity:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleOpacity = styleValue.mlnStyleValue;
}

- (void)setCircleOpacityTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleOpacityTransition = [styleValue getTransition];
}

- (void)setCircleTranslate:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleTranslation = styleValue.mlnStyleValue;
}

- (void)setCircleTranslateTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleTranslationTransition = [styleValue getTransition];
}

- (void)setCircleTranslateAnchor:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleTranslationAnchor = styleValue.mlnStyleValue;
}

- (void)setCirclePitchScale:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleScaleAlignment = styleValue.mlnStyleValue;
}

- (void)setCirclePitchAlignment:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circlePitchAlignment = styleValue.mlnStyleValue;
}

- (void)setCircleStrokeWidth:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeWidth = styleValue.mlnStyleValue;
}

- (void)setCircleStrokeWidthTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeWidthTransition = [styleValue getTransition];
}

- (void)setCircleStrokeColor:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeColor = styleValue.mlnStyleValue;
}

- (void)setCircleStrokeColorTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeColorTransition = [styleValue getTransition];
}

- (void)setCircleStrokeOpacity:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeOpacity = styleValue.mlnStyleValue;
}

- (void)setCircleStrokeOpacityTransition:(MLNCircleStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.circleStrokeOpacityTransition = [styleValue getTransition];
}



- (void)setHeatmapStyleLayerVisibility:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setHeatmapRadius:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapRadius = styleValue.mlnStyleValue;
}

- (void)setHeatmapRadiusTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapRadiusTransition = [styleValue getTransition];
}

- (void)setHeatmapWeight:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapWeight = styleValue.mlnStyleValue;
}

- (void)setHeatmapIntensity:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapIntensity = styleValue.mlnStyleValue;
}

- (void)setHeatmapIntensityTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapIntensityTransition = [styleValue getTransition];
}

- (void)setHeatmapColor:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapColor = styleValue.mlnStyleValue;
}

- (void)setHeatmapOpacity:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapOpacity = styleValue.mlnStyleValue;
}

- (void)setHeatmapOpacityTransition:(MLNHeatmapStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.heatmapOpacityTransition = [styleValue getTransition];
}



- (void)setFillExtrusionStyleLayerVisibility:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setFillExtrusionOpacity:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionOpacity = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionOpacityTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionOpacityTransition = [styleValue getTransition];
}

- (void)setFillExtrusionColor:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionColor = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionColorTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionColorTransition = [styleValue getTransition];
}

- (void)setFillExtrusionTranslate:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionTranslation = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionTranslateTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionTranslationTransition = [styleValue getTransition];
}

- (void)setFillExtrusionTranslateAnchor:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionTranslationAnchor = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionPattern:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionPattern = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionPatternTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionPatternTransition = [styleValue getTransition];
}

- (void)setFillExtrusionHeight:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionHeight = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionHeightTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionHeightTransition = [styleValue getTransition];
}

- (void)setFillExtrusionBase:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionBase = styleValue.mlnStyleValue;
}

- (void)setFillExtrusionBaseTransition:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionBaseTransition = [styleValue getTransition];
}

- (void)setFillExtrusionVerticalGradient:(MLNFillExtrusionStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.fillExtrusionHasVerticalGradient = styleValue.mlnStyleValue;
}



- (void)setRasterStyleLayerVisibility:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setRasterOpacity:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterOpacity = styleValue.mlnStyleValue;
}

- (void)setRasterOpacityTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterOpacityTransition = [styleValue getTransition];
}

- (void)setRasterHueRotate:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterHueRotation = styleValue.mlnStyleValue;
}

- (void)setRasterHueRotateTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterHueRotationTransition = [styleValue getTransition];
}

- (void)setRasterBrightnessMin:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.minimumRasterBrightness = styleValue.mlnStyleValue;
}

- (void)setRasterBrightnessMinTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.minimumRasterBrightnessTransition = [styleValue getTransition];
}

- (void)setRasterBrightnessMax:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.maximumRasterBrightness = styleValue.mlnStyleValue;
}

- (void)setRasterBrightnessMaxTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.maximumRasterBrightnessTransition = [styleValue getTransition];
}

- (void)setRasterSaturation:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterSaturation = styleValue.mlnStyleValue;
}

- (void)setRasterSaturationTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterSaturationTransition = [styleValue getTransition];
}

- (void)setRasterContrast:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterContrast = styleValue.mlnStyleValue;
}

- (void)setRasterContrastTransition:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterContrastTransition = [styleValue getTransition];
}

- (void)setRasterResampling:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterResamplingMode = styleValue.mlnStyleValue;
}

- (void)setRasterFadeDuration:(MLNRasterStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.rasterFadeDuration = styleValue.mlnStyleValue;
}



- (void)setHillshadeStyleLayerVisibility:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setHillshadeIlluminationDirection:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeIlluminationDirection = styleValue.mlnStyleValue;
}

- (void)setHillshadeIlluminationAnchor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeIlluminationAnchor = styleValue.mlnStyleValue;
}

- (void)setHillshadeExaggeration:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeExaggeration = styleValue.mlnStyleValue;
}

- (void)setHillshadeExaggerationTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeExaggerationTransition = [styleValue getTransition];
}

- (void)setHillshadeShadowColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeShadowColor = styleValue.mlnStyleValue;
}

- (void)setHillshadeShadowColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeShadowColorTransition = [styleValue getTransition];
}

- (void)setHillshadeHighlightColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeHighlightColor = styleValue.mlnStyleValue;
}

- (void)setHillshadeHighlightColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeHighlightColorTransition = [styleValue getTransition];
}

- (void)setHillshadeAccentColor:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeAccentColor = styleValue.mlnStyleValue;
}

- (void)setHillshadeAccentColorTransition:(MLNHillshadeStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.hillshadeAccentColorTransition = [styleValue getTransition];
}



- (void)setBackgroundStyleLayerVisibility:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.visible = [styleValue isVisible];
}

- (void)setBackgroundColor:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundColor = styleValue.mlnStyleValue;
}

- (void)setBackgroundColorTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundColorTransition = [styleValue getTransition];
}

- (void)setBackgroundPattern:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundPattern = styleValue.mlnStyleValue;
}

- (void)setBackgroundPatternTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundPatternTransition = [styleValue getTransition];
}

- (void)setBackgroundOpacity:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundOpacity = styleValue.mlnStyleValue;
}

- (void)setBackgroundOpacityTransition:(MLNBackgroundStyleLayer *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.backgroundOpacityTransition = [styleValue getTransition];
}



- (void)setAnchor:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.anchor = styleValue.mlnStyleValue;
}

- (void)setPosition:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.position = [styleValue getSphericalPosition];
}

- (void)setPositionTransition:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.positionTransition = [styleValue getTransition];
}

- (void)setColor:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.color = styleValue.mlnStyleValue;
}

- (void)setColorTransition:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.colorTransition = [styleValue getTransition];
}

- (void)setIntensity:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.intensity = styleValue.mlnStyleValue;
}

- (void)setIntensityTransition:(MLNLight *)layer withReactStyleValue:(MLRNStyleValue *)styleValue
{
    layer.intensityTransition = [styleValue getTransition];
}



- (BOOL)_hasReactStyle:(NSDictionary *)reactStyle
{
  return reactStyle != nil && reactStyle.allKeys.count > 0;
}

@end
