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

- (void)addRequestHeader:(NSString *)name value:(NSString *)value match:(NSString *_Nullable)match {
  [MLRNNetworkHTTPHeaders.sharedInstance addRequestHeader:name value:value match:match];
}

- (void)removeRequestHeader:(NSString *)name {
  [MLRNNetworkHTTPHeaders.sharedInstance removeRequestHeader:name];
}

- (void)setConnected:(BOOL)connected {
  // Android only
}

- (void)addUrlParam:(NSString *)key value:(NSString *)value match:(NSString *_Nullable)match {
  [MLRNNetworkHTTPHeaders.sharedInstance addUrlParam:key value:value match:match];
}

- (void)removeUrlParam:(NSString *)key {
  [MLRNNetworkHTTPHeaders.sharedInstance removeUrlParam:key];
}

@end
