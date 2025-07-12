#import "MLRNMapViewModule.h"

#import "FilterParser.h"
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

RCT_EXPORT_METHOD(getPointInView : (nonnull NSNumber *)reactTag coordinate : (NSArray<NSNumber *> *)
                      coordinate resolve : (RCTPromiseResolveBlock)
                          resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getPointInView:view
                                        coordinate:coordinate
                                           resolve:resolve
                                            reject:reject];
              }
             reject:reject
         methodName:@"getPointInView"];
}

RCT_EXPORT_METHOD(
    getCoordinateFromView : (nonnull NSNumber *)reactTag point : (NSArray<NSNumber *> *)
        point resolve : (RCTPromiseResolveBlock)resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager
                    getCoordinateFromView:view
                                    point:CGPointMake(point[0].floatValue, point[1].floatValue)
                                  resolve:resolve
                                   reject:reject];
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
                                     resolve:resolve
                                      reject:reject];
              }
             reject:reject
         methodName:@"takeSnap"];
}

RCT_EXPORT_METHOD(getVisibleBounds : (nonnull NSNumber *)reactTag resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getVisibleBounds:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getVisibleBounds"];
}

RCT_EXPORT_METHOD(getZoom : (nonnull NSNumber *)reactTag resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getZoom:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getZoom"];
}

RCT_EXPORT_METHOD(getCenter : (nonnull NSNumber *)reactTag resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getCenter:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getCenter"];
}

RCT_EXPORT_METHOD(queryRenderedFeaturesAtPoint : (nonnull NSNumber *)reactTag point : (
    NSArray<NSNumber *> *)point layerIDs : (NSArray<NSString *> *)layerIDs filter : (NSArray *)
                      filter resolve : (RCTPromiseResolveBlock)
                          resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                NSSet *layerIDSet = nil;
                if (layerIDs != nil && layerIDs.count > 0) {
                  layerIDSet = [NSSet setWithArray:layerIDs];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesAtPoint:view
                                                           point:CGPointMake(point[0].floatValue,
                                                                             point[1].floatValue)
                                                        layerIDs:layerIDSet
                                                       predicate:predicate
                                                         resolve:resolve
                                                          reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesAtPoint"];
}

RCT_EXPORT_METHOD(queryRenderedFeaturesInRect : (nonnull NSNumber *)
                      reactTag bbox : (NSArray<NSNumber *> *)bbox layerIDs : (NSArray<NSString *> *)
                          layerIDs filter : (NSArray *)filter resolve : (RCTPromiseResolveBlock)
                              resolve reject : (RCTPromiseRejectBlock)reject) {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                // bbox[top, right, bottom, left]
                CGFloat width = [bbox[1] floatValue] - [bbox[3] floatValue];
                CGFloat height = [bbox[0] floatValue] - [bbox[2] floatValue];
                CGRect rect = CGRectMake([bbox[3] floatValue], [bbox[2] floatValue], width, height);

                NSSet *layerIDSet = nil;
                if (layerIDs != nil && layerIDs.count > 0) {
                  layerIDSet = [NSSet setWithArray:layerIDs];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesInRect:view
                                                           bbox:rect
                                                       layerIDs:layerIDSet
                                                      predicate:predicate
                                                        resolve:resolve
                                                         reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesInRect"];
}

@end
