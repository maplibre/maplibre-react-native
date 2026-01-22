#import "MLRNNetworkModule.h"
#import "MLRNNetworkHTTPHeaders.h"

@implementation MLRNNetworkModule

+ (NSString *)moduleName {
  return @"MLRNNetworkModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNetworkModuleSpecJSI>(params);
}

- (void)addRequestHeader:(NSString *)headerName headerValue:(NSString *)headerValue {
  [MLRNNetworkHTTPHeaders.sharedInstance addRequestHeader:headerValue forHeaderName:headerName];
}

- (void)removeRequestHeader:(NSString *)headerName {
  [MLRNNetworkHTTPHeaders.sharedInstance removeRequestHeader:headerName];
}

- (void)setConnected:(BOOL)connected {
  // Android only
}

@end
