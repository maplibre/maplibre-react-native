#import "MLRNMapViewModule.h"

#import "FilterParser.h"
#import "MLRNMapView.h"
#import "MLRNMapViewComponentView.h"
#import "MLRNMapViewManager.h"
#import "MLRNUtils.h"

@implementation MLRNMapViewModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (NSString *)moduleName {
  return @"MLRNMapViewModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeMapViewModuleSpecJSI>(params);
}

- (void)withMapView:(NSInteger)reactTag
              block:(void (^)(MLRNMapView *))block
             reject:(RCTPromiseRejectBlock)reject
         methodName:(NSString *)methodName {
  [self.viewRegistry_DEPRECATED addUIBlock:^(RCTViewRegistry *viewRegistry) {
    UIView *view =
        [self.viewRegistry_DEPRECATED viewForReactTag:[NSNumber numberWithInteger:reactTag]];

    if ([view isKindOfClass:[MLRNMapViewComponentView class]]) {
      MLRNMapViewComponentView *componentView = (MLRNMapViewComponentView *)view;

      if ([componentView.contentView isKindOfClass:[MLRNMapView class]]) {
        MLRNMapView *mapView = (MLRNMapView *)componentView.contentView;

        block(mapView);
        return;
      }
    }

    reject(methodName,
           [NSString stringWithFormat:@"Invalid `reactTag` %@, could not find MLRNMapView",
                                      [NSNumber numberWithInteger:reactTag]],
           nil);
  }];
}

- (void)getCenter:(NSInteger)reactTag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getCenter:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getCenter"];
}

- (void)getZoom:(NSInteger)reactTag
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getZoom:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getZoom"];
}

- (void)getBearing:(NSInteger)reactTag
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getBearing:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getBearing"];
}

- (void)getPitch:(NSInteger)reactTag
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getPitch:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getPitch"];
}

- (void)getBounds:(NSInteger)reactTag
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getBounds:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getBounds"];
}

- (void)getViewState:(NSInteger)reactTag
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager getViewState:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"getViewState"];
}

- (void)project:(NSInteger)reactTag
     coordinate:(JS::NativeMapViewModule::SpecProjectCoordinate &)coordinate
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D transformedCoordinate =
      CLLocationCoordinate2DMake(coordinate.latitude(), coordinate.longitude());

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager project:view
                                 coordinate:transformedCoordinate
                                    resolve:resolve
                                     reject:reject];
              }
             reject:reject
         methodName:@"project"];
}

- (void)unproject:(NSInteger)reactTag
            point:(JS::NativeMapViewModule::SpecUnprojectPoint &)point
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  CGPoint transformedPoint = CGPointMake(point.locationX(), point.locationY());

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager unproject:view
                                        point:transformedPoint
                                      resolve:resolve
                                       reject:reject];
              }
             reject:reject
         methodName:@"unproject"];
}

- (void)takeSnap:(NSInteger)reactTag
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

- (void)queryRenderedFeaturesWithCoordinate:(NSInteger)reactTag
                                 coordinate:
                                     (JS::NativeMapViewModule::
                                          SpecQueryRenderedFeaturesWithCoordinateCoordinate &)
                                         coordinate
                                     layers:(nonnull NSArray<NSString *> *)layers
                                     filter:(nonnull NSArray *)filter
                                    resolve:(nonnull RCTPromiseResolveBlock)resolve
                                     reject:(nonnull RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D transformedCoordinate =
      CLLocationCoordinate2DMake(coordinate.latitude(), coordinate.longitude());

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                NSSet *layerIdSet = nil;
                if (layers != nil && layers.count > 0) {
                  layerIdSet = [NSSet setWithArray:layers];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesWithCoordinate:view
                                                             coordinate:transformedCoordinate
                                                               layerIds:layerIdSet
                                                              predicate:predicate
                                                                resolve:resolve
                                                                 reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesWithCoordinate"];
}

- (void)queryRenderedFeaturesWithBounds:(NSInteger)reactTag
                                 bounds:(NSArray<NSNumber *> *)bounds
                                 layers:(NSArray<NSString *> *)layers
                                 filter:(NSArray *)filter
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                MLNCoordinateBounds coordinateBounds = [MLRNUtils fromReactBounds:bounds];

                NSSet *layerIdSet = nil;
                if (layers != nil && layers.count > 0) {
                  layerIdSet = [NSSet setWithArray:layers];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesWithBounds:view
                                                             bounds:coordinateBounds
                                                           layerIds:layerIdSet
                                                          predicate:predicate
                                                            resolve:resolve
                                                             reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesInRect"];
}

- (void)showAttribution:(NSInteger)reactTag
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager showAttribution:view resolve:resolve reject:reject];
              }
             reject:reject
         methodName:@"showAttribution"];
}

- (void)setSourceVisibility:(NSInteger)reactTag
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
