#import "MLRNNetworkModule.h"

@implementation MLRNNetworkModule

+ (NSString *)moduleName {
  return @"MLRNNetworkModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNetworkModuleSpecJSI>(params);
}

- (void)setConnected:(BOOL)connected {
  // Android only
}

@end
