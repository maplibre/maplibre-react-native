#import "MLRNModule.h"
#import "MLRNEventTypes.h"
#import "MLRNOfflineModule.h"
#import "CameraMode.h"
#import "MLRNSource.h"
#import "MLRNCustomHeaders.h"
@import MapLibre;

@implementation MLRNModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSDictionary<NSString *, id> *)constantsToExport
{
    // style urls
    NSMutableDictionary *styleURLS = [[NSMutableDictionary alloc] init];
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
         @"OfflineCallbackName": offlineModuleCallbackNames,
         @"OfflinePackDownloadState": offlinePackDownloadState,
         @"LocationCallbackName": locationModuleEvents
    };
}

/**
* @deprecated This will be removed in the next major version.
* @see https://github.com/maplibre/maplibre-react-native/issues/25#issuecomment-1382382044
*/
RCT_EXPORT_METHOD(setAccessToken:(NSString *)accessToken)
{
    if (accessToken.length > 0) {
      [MLNSettings setApiKey:accessToken];
    }
}

RCT_EXPORT_METHOD(addCustomHeader:(NSString *)headerName forHeaderValue:(NSString *) headerValue)
{
    [MLRNCustomHeaders.sharedInstance addHeader:headerValue forHeaderName:headerName];
}

RCT_EXPORT_METHOD(removeCustomHeader:(NSString *)headerName)
{
    [MLRNCustomHeaders.sharedInstance removeHeader:headerName];
}

/**
* @deprecated This will be removed in the next major version.
* @see https://github.com/maplibre/maplibre-react-native/issues/25#issuecomment-1382382044
*/
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
