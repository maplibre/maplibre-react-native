#import "MLRNImagesModule.h"

#import <MapLibreReactNativeSpec/MapLibreReactNativeSpec.h>

@interface MLRNImagesModule () <NativeImagesModuleSpec>
@end

@implementation MLRNImagesModule

@synthesize moduleRegistry = _moduleRegistry;

RCT_EXPORT_MODULE()

static MLRNImagesModule *_sharedInstance = nil;

+ (instancetype)sharedInstance {
  return _sharedInstance;
}

- (instancetype)init {
  if (self = [super init]) {
    _sharedInstance = self;
  }

  return self;
}

- (id<RCTImageLoaderProtocol>)imageLoader {
  return [_moduleRegistry moduleForName:"ImageLoader"];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeImagesModuleSpecJSI>(params);
}

@end
