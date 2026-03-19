#import "MLRNImagesModule.h"
#import "MLRNImageLoader.h"

#import <MapLibreReactNativeSpec/MapLibreReactNativeSpec.h>

@implementation MLRNImagesModule

@synthesize moduleRegistry = _moduleRegistry;

+ (NSString *)moduleName {
  return @"MLRNImagesModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeImagesModuleSpecJSI>(params);
}

- (void)initialize {
  [MLRNImageLoader sharedInstance].imageLoader = [_moduleRegistry moduleForName:"ImageLoader"];
}

@end
