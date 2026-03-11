#import "MLRNImagesModule.h"
#import "MLRNImagesProvider.h"

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

- (void)initImageLoader {
  [MLRNImagesProvider sharedInstance].imageLoader = [_moduleRegistry moduleForName:"ImageLoader"
                                                             lazilyLoadIfNecessary:YES];
}

@end
