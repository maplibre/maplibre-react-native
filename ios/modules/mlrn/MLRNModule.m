#import "MLRNModule.h"
#import "MLRNCustomHeaders.h"
#import "MLRNEventTypes.h"
#import "MLRNSource.h"
@import MapLibre;

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

  return @{
    @"StyleURL" : styleURLS,
    @"EventTypes" : eventTypes,
    @"StyleSource" : styleSourceConsts,
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
