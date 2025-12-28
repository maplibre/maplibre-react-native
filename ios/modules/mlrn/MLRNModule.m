#import "MLRNModule.h"
#import "MLRNCustomHeaders.h"
#import "MLRNEventTypes.h"
#import "MLRNSource.h"
@import MapLibre;

// Offline callback name constants - must match src/constants.ts
static NSString *const RCT_MLRN_OFFLINE_CALLBACK_ERROR = @"OfflineError";
static NSString *const RCT_MLRN_OFFLINE_CALLBACK_PROGRESS = @"OfflineProgress";

@implementation MLRNModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSDictionary<NSString *, id> *)constantsToExport {
  // style urls
  NSMutableDictionary *styleURLS = [[NSMutableDictionary alloc] init];
  [styleURLS setObject:[[MLNStyle defaultStyleURL] absoluteString] forKey:@"Default"];

  // event types
  NSMutableDictionary *eventTypes = [[NSMutableDictionary alloc] init];
  [eventTypes setObject:RCT_MLRN_PRESS forKey:@"Press"];
  [eventTypes setObject:RCT_MLRN_LONG_PRESS forKey:@"LongPress"];

  // style sources
  NSMutableDictionary *styleSourceConsts = [[NSMutableDictionary alloc] init];
  [styleSourceConsts setObject:DEFAULT_SOURCE_ID forKey:@"DefaultSourceID"];

  // offline module callback names
  NSMutableDictionary *offlineModuleCallbackNames = [[NSMutableDictionary alloc] init];
  [offlineModuleCallbackNames setObject:RCT_MLRN_OFFLINE_CALLBACK_ERROR forKey:@"Error"];
  [offlineModuleCallbackNames setObject:RCT_MLRN_OFFLINE_CALLBACK_PROGRESS forKey:@"Progress"];

  NSMutableDictionary *offlinePackDownloadState = [[NSMutableDictionary alloc] init];
  [offlinePackDownloadState setObject:@(MLNOfflinePackStateInactive) forKey:@"Inactive"];
  [offlinePackDownloadState setObject:@(MLNOfflinePackStateActive) forKey:@"Active"];
  [offlinePackDownloadState setObject:@(MLNOfflinePackStateComplete) forKey:@"Complete"];

  return @{
    @"StyleURL" : styleURLS,
    @"EventTypes" : eventTypes,
    @"StyleSource" : styleSourceConsts,
    @"OfflineCallbackName" : offlineModuleCallbackNames,
    @"OfflinePackDownloadState" : offlinePackDownloadState,
  };
}

RCT_EXPORT_METHOD(addCustomHeader : (NSString *)headerName forHeaderValue : (NSString *)
                      headerValue) {
  [MLRNCustomHeaders.sharedInstance addHeader:headerValue forHeaderName:headerName];
}

RCT_EXPORT_METHOD(removeCustomHeader : (NSString *)headerName) {
  [MLRNCustomHeaders.sharedInstance removeHeader:headerName];
}

@end
