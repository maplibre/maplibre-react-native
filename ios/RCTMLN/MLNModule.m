//
//  MLNModule.m
//  RCTMLN
//
//  Created by Nick Italiano on 8/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLNModule.h"
#import "RCTMLNEventTypes.h"
#import "MLNOfflineModule.h"
#import "CameraMode.h"
#import "RCTMLNSource.h"
#import "MLNCustomHeaders.h"
@import MapLibre;

@implementation MLNModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSDictionary<NSString *, id> *)constantsToExport
{
    // style urls
    NSMutableDictionary *styleURLS = [[NSMutableDictionary alloc] init];

    for (MLNDefaultStyle* style in [MLNStyle predefinedStyles]) {
      [styleURLS setObject:[style.url absoluteString] forKey:style.name];
    }
    [styleURLS setObject:[[MLNStyle defaultStyleURL] absoluteString] forKey:@"Default"];

    // event types
    NSMutableDictionary *eventTypes = [[NSMutableDictionary alloc] init];
    [eventTypes setObject:RCT_MAPBOX_EVENT_TAP forKey:@"MapClick"];
    [eventTypes setObject:RCT_MAPBOX_EVENT_LONGPRESS forKey:@"MapLongClick"];
    [eventTypes setObject:RCT_MAPBOX_REGION_WILL_CHANGE_EVENT forKey:@"RegionWillChange"];
    [eventTypes setObject:RCT_MAPBOX_REGION_IS_CHANGING forKey:@"RegionIsChanging"];
    [eventTypes setObject:RCT_MAPBOX_REGION_DID_CHANGE forKey:@"RegionDidChange"];
    [eventTypes setObject:RCT_MAPBOX_WILL_START_LOADING_MAP forKey:@"WillStartLoadingMap"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINISH_LOADING_MAP forKey:@"DidFinishLoadingMap"];
    [eventTypes setObject:RCT_MAPBOX_DID_FAIL_LOADING_MAP forKey:@"DidFailLoadingMap"];
    [eventTypes setObject:RCT_MAPBOX_WILL_START_RENDERING_FRAME forKey:@"WillStartRenderingFrame"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINSIH_RENDERING_FRAME forKey:@"DidFinishRenderingFrame"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINISH_RENDERING_FRAME_FULLY forKey:@"DidFinishRenderingFrameFully"];
    [eventTypes setObject:RCT_MAPBOX_WILL_START_RENDERING_MAP forKey:@"WillStartRenderingMap"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINISH_RENDERING_MAP forKey:@"DidFinishRenderingMap"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINISH_RENDERING_MAP_FULLY forKey:@"DidFinishRenderingMapFully"];
    [eventTypes setObject:RCT_MAPBOX_DID_FINISH_LOADING_STYLE forKey:@"DidFinishLoadingStyle"];

    // location module events
    NSMutableDictionary *locationModuleEvents = [[NSMutableDictionary alloc] init];
    [locationModuleEvents setObject:RCT_MAPBOX_USER_LOCATION_UPDATE forKey:@"Update"];

    // user tracking modes
    NSMutableDictionary *userTrackingModes = [[NSMutableDictionary alloc] init];
    [userTrackingModes setObject:[NSNumber numberWithInt:MLNUserTrackingModeNone] forKey:@"None"];
    [userTrackingModes setObject:[NSNumber numberWithInt:MLNUserTrackingModeFollow] forKey:@"Follow"];
    [userTrackingModes setObject:[NSNumber numberWithInt:MLNUserTrackingModeFollowWithHeading] forKey:@"FollowWithHeading"];
    [userTrackingModes setObject:[NSNumber numberWithInt:MLNUserTrackingModeFollowWithCourse] forKey:@"FollowWithCourse"];

    // user location vertical alignment
    NSMutableDictionary *userLocationVerticalAlignment = [[NSMutableDictionary alloc] init];
    [userLocationVerticalAlignment setObject:[NSNumber numberWithInt:MLNAnnotationVerticalAlignmentTop] forKey:@"Top"];
    [userLocationVerticalAlignment setObject:[NSNumber numberWithInt:MLNAnnotationVerticalAlignmentCenter] forKey:@"Center"];
    [userLocationVerticalAlignment setObject:[NSNumber numberWithInt:MLNAnnotationVerticalAlignmentBottom] forKey:@"Bottom"];

    // camera modes
    NSMutableDictionary *cameraModes = [[NSMutableDictionary alloc] init];
    [cameraModes setObject:[NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_FLIGHT] forKey:@"Flight"];
    [cameraModes setObject:[NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_EASE] forKey:@"Ease"];
    [cameraModes setObject:[NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_LINEAR] forKey:@"Linear"];
    [cameraModes setObject:[NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_NONE] forKey:@"None"];

    // style sources
    NSMutableDictionary *styleSourceConsts = [[NSMutableDictionary alloc] init];
    [styleSourceConsts setObject:DEFAULT_SOURCE_ID forKey:@"DefaultSourceID"];

    // line layer constants
    NSMutableDictionary *lineJoin = [[NSMutableDictionary alloc] init];
    [lineJoin setObject:@(MLNLineJoinBevel) forKey:@"Bevel"];
    [lineJoin setObject:@(MLNLineJoinRound) forKey:@"Round"];
    [lineJoin setObject:@(MLNLineJoinMiter) forKey:@"Miter"];

    NSMutableDictionary *lineCap = [[NSMutableDictionary alloc] init];
    [lineCap setObject:@(MLNLineCapButt) forKey:@"Butt"];
    [lineCap setObject:@(MLNLineCapRound) forKey:@"Round"];
    [lineCap setObject:@(MLNLineCapSquare) forKey:@"Square"];

    NSMutableDictionary *lineTranslateAnchor = [[NSMutableDictionary alloc] init];
    [lineTranslateAnchor setObject:@(MLNLineTranslationAnchorMap) forKey:@"Map"];
    [lineTranslateAnchor setObject:@(MLNLineTranslationAnchorViewport) forKey:@"Viewport"];

    // circle layer constants
    NSMutableDictionary *circlePitchScale = [[NSMutableDictionary alloc] init];
    [circlePitchScale setObject:@(MLNCircleScaleAlignmentMap) forKey:@"Map"];
    [circlePitchScale setObject:@(MLNCircleScaleAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *circlePitchAlignment = [[NSMutableDictionary alloc] init];
    [circlePitchAlignment setObject:@(MLNCirclePitchAlignmentMap) forKey:@"Map"];
    [circlePitchAlignment setObject:@(MLNCirclePitchAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *circleTranslateAnchor = [[NSMutableDictionary alloc] init];
    [circleTranslateAnchor setObject:@(MLNCircleTranslationAnchorMap) forKey:@"Map"];
    [circleTranslateAnchor setObject:@(MLNCircleTranslationAnchorViewport) forKey:@"Viewport"];

    // fill extrusion layer constants
    NSMutableDictionary *fillExtrusionTranslateAnchor = [[NSMutableDictionary alloc] init];
    [fillExtrusionTranslateAnchor setObject:@(MLNFillExtrusionTranslationAnchorMap) forKey:@"Map"];
    [fillExtrusionTranslateAnchor setObject:@(MLNFillExtrusionTranslationAnchorViewport) forKey:@"Viewport"];

    // fill layer constants
    NSMutableDictionary *fillTranslateAnchor = [[NSMutableDictionary alloc] init];
    [fillTranslateAnchor setObject:@(MLNFillTranslationAnchorMap) forKey:@"Map"];
    [fillTranslateAnchor setObject:@(MLNFillTranslationAnchorViewport) forKey:@"Viewport"];

    // symbol layer constants
    NSMutableDictionary *iconRotationAlignment = [[NSMutableDictionary alloc] init];
    [iconRotationAlignment setObject:@(MLNIconRotationAlignmentAuto) forKey:@"Auto"];
    [iconRotationAlignment setObject:@(MLNIconRotationAlignmentMap) forKey:@"Map"];
    [iconRotationAlignment setObject:@(MLNIconRotationAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *iconTextFit = [[NSMutableDictionary alloc] init];
    [iconTextFit setObject:@(MLNIconTextFitNone) forKey:@"None"];
    [iconTextFit setObject:@(MLNIconTextFitWidth) forKey:@"Width"];
    [iconTextFit setObject:@(MLNIconTextFitHeight) forKey:@"Height"];
    [iconTextFit setObject:@(MLNIconTextFitBoth) forKey:@"Both"];

    NSMutableDictionary *iconAnchor = [[NSMutableDictionary alloc] init];
    [iconAnchor setObject:@(MLNIconAnchorCenter) forKey:@"Center"];
    [iconAnchor setObject:@(MLNIconAnchorTop) forKey:@"Top"];
    [iconAnchor setObject:@(MLNIconAnchorBottom) forKey:@"Bottom"];
    [iconAnchor setObject:@(MLNIconAnchorLeft) forKey:@"Left"];
    [iconAnchor setObject:@(MLNIconAnchorRight) forKey:@"Right"];
    [iconAnchor setObject:@(MLNIconAnchorTopLeft) forKey:@"TopLeft"];
    [iconAnchor setObject:@(MLNIconAnchorTopRight) forKey:@"TopRight"];
    [iconAnchor setObject:@(MLNIconAnchorBottomLeft) forKey:@"BottomLeft"];
    [iconAnchor setObject:@(MLNIconAnchorBottomRight) forKey:@"BottomRight"];

    NSMutableDictionary *iconTranslateAnchor = [[NSMutableDictionary alloc] init];
    [iconTranslateAnchor setObject:@(MLNIconTranslationAnchorMap) forKey:@"Map"];
    [iconTranslateAnchor setObject:@(MLNIconTranslationAnchorViewport) forKey:@"Viewport"];

    NSMutableDictionary *iconPitchAlignment = [[NSMutableDictionary alloc] init];
    [iconPitchAlignment setObject:@(MLNIconPitchAlignmentAuto) forKey:@"Auto"];
    [iconPitchAlignment setObject:@(MLNIconPitchAlignmentMap) forKey:@"Map"];
    [iconPitchAlignment setObject:@(MLNIconPitchAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *symbolPlacement = [[NSMutableDictionary alloc] init];
    [symbolPlacement setObject:@(MLNSymbolPlacementLine) forKey:@"Line"];
    [symbolPlacement setObject:@(MLNSymbolPlacementPoint) forKey:@"Point"];

    NSMutableDictionary *textAnchor = [[NSMutableDictionary alloc] init];
    [textAnchor setObject:@(MLNTextAnchorCenter) forKey:@"Center"];
    [textAnchor setObject:@(MLNTextAnchorLeft) forKey:@"Left"];
    [textAnchor setObject:@(MLNTextAnchorRight) forKey:@"Right"];
    [textAnchor setObject:@(MLNTextAnchorTop) forKey:@"Top"];
    [textAnchor setObject:@(MLNTextAnchorBottom) forKey:@"Bottom"];
    [textAnchor setObject:@(MLNTextAnchorTopLeft) forKey:@"TopLeft"];
    [textAnchor setObject:@(MLNTextAnchorTopRight) forKey:@"TopRight"];
    [textAnchor setObject:@(MLNTextAnchorBottomLeft) forKey:@"BottomLeft"];
    [textAnchor setObject:@(MLNTextAnchorBottomRight) forKey:@"BottomRight"];

    NSMutableDictionary *textJustify = [[NSMutableDictionary alloc] init];
    [textJustify setObject:@(MLNTextJustificationCenter) forKey:@"Center"];
    [textJustify setObject:@(MLNTextJustificationLeft) forKey:@"Left"];
    [textJustify setObject:@(MLNTextJustificationRight) forKey:@"Right"];

    NSMutableDictionary *textPitchAlignment = [[NSMutableDictionary alloc] init];
    [textPitchAlignment setObject:@(MLNTextPitchAlignmentAuto) forKey:@"Auto"];
    [textPitchAlignment setObject:@(MLNTextPitchAlignmentMap) forKey:@"Map"];
    [textPitchAlignment setObject:@(MLNTextPitchAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *textRotationAlignment = [[NSMutableDictionary alloc] init];
    [textRotationAlignment setObject:@(MLNTextRotationAlignmentAuto) forKey:@"Auto"];
    [textRotationAlignment setObject:@(MLNTextRotationAlignmentMap) forKey:@"Map"];
    [textRotationAlignment setObject:@(MLNTextRotationAlignmentViewport) forKey:@"Viewport"];

    NSMutableDictionary *textTransform = [[NSMutableDictionary alloc] init];
    [textTransform setObject:@(MLNTextTransformNone) forKey:@"None"];
    [textTransform setObject:@(MLNTextTransformLowercase) forKey:@"Lowercase"];
    [textTransform setObject:@(MLNTextTransformUppercase) forKey:@"Uppercase"];

    NSMutableDictionary *textTranslateAnchor = [[NSMutableDictionary alloc] init];
    [textTranslateAnchor setObject:@(MLNTextTranslationAnchorMap) forKey:@"Map"];
    [textTranslateAnchor setObject:@(MLNTextTranslationAnchorViewport) forKey:@"Viewport"];

    // light constants
    NSMutableDictionary *lightAnchor = [[NSMutableDictionary alloc] init];
    [lightAnchor setObject:@(MLNLightAnchorMap) forKey:@"Map"];
    [lightAnchor setObject:@(MLNLightAnchorViewport) forKey:@"Viewport"];

    // offline module callback names
    NSMutableDictionary *offlineModuleCallbackNames = [[NSMutableDictionary alloc] init];
    [offlineModuleCallbackNames setObject:RCT_MAPBOX_OFFLINE_CALLBACK_ERROR forKey:@"Error"];
    [offlineModuleCallbackNames setObject:RCT_MAPBOX_OFFLINE_CALLBACK_PROGRESS forKey:@"Progress"];

    NSMutableDictionary *offlinePackDownloadState = [[NSMutableDictionary alloc] init];
    [offlinePackDownloadState setObject:@(MLNOfflinePackStateInactive) forKey:@"Inactive"];
    [offlinePackDownloadState setObject:@(MLNOfflinePackStateActive) forKey:@"Active"];
    [offlinePackDownloadState setObject:@(MLNOfflinePackStateComplete) forKey:@"Complete"];

    return @{
         @"StyleURL": styleURLS,
         @"EventTypes": eventTypes,
         @"UserTrackingModes": userTrackingModes,
         @"UserLocationVerticalAlignment": userLocationVerticalAlignment,
         @"CameraModes": cameraModes,
         @"StyleSource": styleSourceConsts,
         @"LineJoin": lineJoin,
         @"LineCap": lineCap,
         @"LineTranslateAnchor": lineTranslateAnchor,
         @"CirclePitchScale": circlePitchScale,
         @"CircleTranslateAnchor": circleTranslateAnchor,
         @"CirclePitchAlignment": circlePitchAlignment,
         @"FillExtrusionTranslateAnchor": fillExtrusionTranslateAnchor,
         @"FillTranslateAnchor": fillTranslateAnchor,
         @"IconRotationAlignment": iconRotationAlignment,
         @"IconTextFit": iconTextFit,
         @"IconTranslateAnchor": iconTranslateAnchor,
         @"IconAnchor": iconAnchor,
         @"IconPitchAlignment": iconPitchAlignment,
         @"SymbolPlacement": symbolPlacement,
         @"TextAnchor": textAnchor,
         @"TextJustify": textJustify,
         @"TextPitchAlignment": textPitchAlignment,
         @"TextRotationAlignment": textRotationAlignment,
         @"TextTransform": textTransform,
         @"TextTranslateAnchor": textTranslateAnchor,
         @"LightAnchor": lightAnchor,
         @"OfflineCallbackName": offlineModuleCallbackNames,
         @"OfflinePackDownloadState": offlinePackDownloadState,
         @"LocationCallbackName": locationModuleEvents
    };
}

RCT_EXPORT_METHOD(setAccessToken:(NSString *)accessToken)
{
    if (accessToken.length > 0) {
      [MLNSettings setApiKey:accessToken];
    }
}

RCT_EXPORT_METHOD(addCustomHeader:(NSString *)headerName forHeaderValue:(NSString *) headerValue)
{
    [MLNCustomHeaders.sharedInstance addHeader:headerValue forHeaderName:headerName];
}

RCT_EXPORT_METHOD(removeCustomHeader:(NSString *)headerName)
{
    [MLNCustomHeaders.sharedInstance removeHeader:headerName];
}

RCT_EXPORT_METHOD(getAccessToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString* accessToken = MLNSettings.apiKey;

    if (accessToken != nil) {
        resolve(accessToken);
        return;
    }

    reject(@"missing_access_token", @"No access token has been set", nil);
}

@end
