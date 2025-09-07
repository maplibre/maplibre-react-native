#import "MLRNCameraModule.h"

#import "FilterParser.h"
#import "MLRNCamera.h"
#import "MLRNCameraComponentView.h"
#import "MLRNCameraManager.h"

@implementation MLRNCameraModule
RCT_EXPORT_MODULE()

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeCameraModuleSpecJSI>(params);
}

- (void)withCamera:(nonnull NSNumber *)reactTag
             block:(void (^)(MLRNCamera *))block
            reject:(RCTPromiseRejectBlock)reject
        methodName:(NSString *)methodName {
  [self.viewRegistry_DEPRECATED addUIBlock:^(RCTViewRegistry *viewRegistry) {
    MLRNCameraComponentView *componentView =
        [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
    MLRNCamera *view = componentView.contentView;

    if (view != nil) {
      block(view);
    } else {
      reject(
          methodName,
          [NSString stringWithFormat:@"Invalid `reactTag` %@, could not find MLRNCamera", reactTag],
          nil);
    }
  }];
}

- (void)setStop:(nonnull NSNumber *)reactTag
           stop:(NSDictionary<NSString *, id> *)stop
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  [self withCamera:reactTag
             block:^(MLRNCamera *view) {
               [MLRNCameraManager setStop:view stop:stop resolve:resolve reject:reject];
             }
            reject:reject
        methodName:@"setStop"];
}

@end
