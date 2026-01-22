#import "MLRNRequestModule.h"
#import "MLRNRequestHeaders.h"

@implementation MLRNRequestModule

+ (NSString *)moduleName {
  return @"MLRNRequestModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRequestModuleSpecJSI>(params);
}

- (void)addHeader:(NSString *)headerName headerValue:(NSString *)headerValue {
  [MLRNRequestHeaders.sharedInstance addHeader:headerValue forHeaderName:headerName];
}

- (void)removeHeader:(NSString *)headerName {
  [MLRNRequestHeaders.sharedInstance removeHeader:headerName];
}

- (void)setConnected:(BOOL)connected {
  // Note: setConnected is not available on iOS MLNNetworkConfiguration.
  // This method is a no-op on iOS. On Android, MapLibre.setConnected() is used.
}

@end
