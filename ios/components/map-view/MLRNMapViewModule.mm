#import "MLRNMapViewModule.h"

#import "MLRNMapView.h"
#import "MLRNMapViewManager.h"

@implementation MLRNMapViewModule
RCT_EXPORT_MODULE()

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeMapViewModuleSpecJSI>(params);
}

- (void)withMapView:(nonnull NSNumber *)reactTag
              block:(void (^)(MLRNMapView *))block
             reject:(RCTPromiseRejectBlock)reject
         methodName:(NSString *)methodName {
  [self.viewRegistry_DEPRECATED addUIBlock:^(RCTViewRegistry *viewRegistry) {
    MLRNMapView *view = [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];

    if (view != nil) {
      block(view);
    } else {
      reject(methodName,
             [NSString
                 stringWithFormat:@"Invalid `reactTag` %@, could not find MLRNMapView", reactTag],
             nil);
    }
  }];
}

RCT_EXPORT_METHOD(getPointInView : (nonnull NSNumber *)reactTag atCoordinate : (
    NSArray<NSNumber *> *)atCoordinate resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getPointInView:view
                                      atCoordinate:atCoordinate
                                          resolver:resolve
                                          rejecter:reject];
              }
             reject:reject
         methodName:@"getPointInView"];
}

RCT_EXPORT_METHOD(
    getCoordinateFromView : (nonnull NSNumber *)reactTag atPoint : (NSArray<NSNumber *> *)
        atPoint resolve : (RCTPromiseResolveBlock)resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                NSNumber *x = [atPoint objectAtIndex:0];
                NSNumber *y = [atPoint objectAtIndex:1];

                [MLRNMapViewManager getCoordinateFromView:view
                                                  atPoint:CGPointMake(x.floatValue, y.floatValue)
                                                 resolver:resolve
                                                 rejecter:reject];
              }
             reject:reject
         methodName:@"getCoordinateFromView"];
}

RCT_EXPORT_METHOD(takeSnap : (nonnull NSNumber *)reactTag writeToDisk : (BOOL)
                      writeToDisk resolve : (RCTPromiseResolveBlock)
                          resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager takeSnap:view
                                 writeToDisk:writeToDisk
                                    resolver:resolve
                                    rejecter:reject];
              }
             reject:reject
         methodName:@"takeSnap"];
}

RCT_EXPORT_METHOD(getZoom : (nonnull NSNumber *)reactTag resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getZoom:view resolver:resolve rejecter:reject];
              }
             reject:reject
         methodName:@"getZoom"];
}

RCT_EXPORT_METHOD(getCenter : (nonnull NSNumber *)reactTag resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getCenter:view resolver:resolve rejecter:reject];
              }
             reject:reject
         methodName:@"getCenter"];
}

@end
