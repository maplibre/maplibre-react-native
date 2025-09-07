#import "MLRNMapViewModule.h"

#import "FilterParser.h"
#import "MLRNMapView.h"
#import "MLRNMapViewComponentView.h"
#import "MLRNMapViewManager.h"

@implementation MLRNMapViewModule

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
    MLRNMapViewComponentView *componentView =
        [self.viewRegistry_DEPRECATED viewForReactTag:reactTag];
    MLRNMapView *view = componentView.contentView;

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

- (void)getCenter:(nonnull NSNumber *)reactTag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getCenter:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getCenter"];
}

- (void)getZoom:(nonnull NSNumber *)reactTag
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getZoom:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getZoom"];
}

- (void)getBearing:(nonnull NSNumber *)reactTag
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getBearing:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getBearing"];
}

- (void)getPitch:(nonnull NSNumber *)reactTag
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getPitch:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getPitch"];
}

- (void)getBounds:(nonnull NSNumber *)reactTag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getBounds:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getBounds"];
}

- (void)getViewState:(nonnull NSNumber *)reactTag
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getViewState:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getViewState"];
}

- (void)getPointInView:(nonnull NSNumber *)reactTag
            coordinate:(NSArray<NSNumber *> *)coordinate
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
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

- (void)getCoordinateFromView:(nonnull NSNumber *)reactTag
                        point:(NSArray<NSNumber *> *)point
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
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

- (void)takeSnap:(nonnull NSNumber *)reactTag
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
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

- (void)queryRenderedFeaturesAtPoint:(nonnull NSNumber *)reactTag
                               point:(NSArray<NSNumber *> *)point
                            layerIds:(NSArray<NSString *> *)layerIds
                              filter:(NSArray *)filter
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                NSSet *layerIdSet = nil;
                if (layerIds != nil && layerIds.count > 0) {
                  layerIdSet = [NSSet setWithArray:layerIds];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesAtPoint:view
                                                           point:CGPointMake(point[0].floatValue,
                                                                             point[1].floatValue)
                                                        layerIds:layerIdSet
                                                       predicate:predicate
                                                         resolve:resolve
                                                          reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesAtPoint"];
}

- (void)queryRenderedFeaturesInRect:(nonnull NSNumber *)reactTag
                               bbox:(NSArray<NSNumber *> *)bbox
                           layerIds:(NSArray<NSString *> *)layerIds
                             filter:(NSArray *)filter
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                // bbox[top, right, bottom, left]
                CGFloat width = [bbox[1] floatValue] - [bbox[3] floatValue];
                CGFloat height = [bbox[0] floatValue] - [bbox[2] floatValue];
                CGRect rect = CGRectMake([bbox[3] floatValue], [bbox[2] floatValue], width, height);

                NSSet *layerIdSet = nil;
                if (layerIds != nil && layerIds.count > 0) {
                  layerIdSet = [NSSet setWithArray:layerIds];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesInRect:view
                                                           bbox:rect
                                                       layerIds:layerIdSet
                                                      predicate:predicate
                                                        resolve:resolve
                                                         reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesInRect"];
}

- (void)showAttribution:(nonnull NSNumber *)reactTag
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager showAttribution:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"showAttribution"];
}

- (void)setSourceVisibility:(nonnull NSNumber *)reactTag
                    visible:(BOOL)visible
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(NSString *)sourceLayerId
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager setSourceVisibility:view
                                                visible:visible
                                               sourceId:sourceId
                                          sourceLayerId:sourceLayerId
                                                resolve:resolve
                                                 reject:reject];
              }
             reject:reject
         methodName:@"setSourceVisibility"];
}

@end
