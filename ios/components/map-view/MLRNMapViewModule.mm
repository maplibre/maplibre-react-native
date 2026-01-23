#import "MLRNMapViewModule.h"

#import "FilterParser.h"
#import "MLRNMapView.h"
#import "MLRNMapViewComponentView.h"
#import "MLRNMapViewManager.h"
#import "MLRNUtils.h"
#import "MLRNViewModuleUtils.h"

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
  [MLRNViewModuleUtils withView:self.viewRegistry_DEPRECATED
                       reactTag:reactTag
             componentViewClass:[MLRNMapViewComponentView class]
               contentViewClass:[MLRNMapView class]
                          block:^(UIView *view) {
                            block((MLRNMapView *)view);
                          }
                         reject:reject
                     methodName:methodName];
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
         lngLat:(NSArray<NSNumber *> *)lngLat
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D coordinate =
      CLLocationCoordinate2DMake([lngLat[0] doubleValue], [lngLat[1] doubleValue]);

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager project:view
                                 coordinate:coordinate
                                    resolve:resolve
                                     reject:reject];
              }
             reject:reject
         methodName:@"project"];
}

- (void)unproject:(NSInteger)reactTag
       pixelPoint:(NSArray<NSNumber *> *)pixelPoint
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  CGPoint point = CGPointMake([pixelPoint[0] doubleValue], [pixelPoint[1] doubleValue]);

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                [MLRNMapViewManager unproject:view point:point resolve:resolve reject:reject];
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

- (void)queryRenderedFeaturesWithPoint:(NSInteger)reactTag
                            pixelPoint:(NSArray<NSNumber *> *)pixelPoint
                                layers:(nonnull NSArray<NSString *> *)layers
                                filter:(nonnull NSArray *)filter
                               resolve:(nonnull RCTPromiseResolveBlock)resolve
                                reject:(nonnull RCTPromiseRejectBlock)reject {
  CGPoint point = CGPointMake([pixelPoint[0] doubleValue], [pixelPoint[1] doubleValue]);

  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                NSSet *layerIdSet = nil;
                if (layers != nil && layers.count > 0) {
                  layerIdSet = [NSSet setWithArray:layers];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesWithPoint:view
                                                             point:point
                                                          layerIds:layerIdSet
                                                         predicate:predicate
                                                           resolve:resolve
                                                            reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesWithCoordinate"];
}

- (void)queryRenderedFeaturesWithBounds:(NSInteger)reactTag
                       pixelPointBounds:(NSArray<NSArray<NSNumber *> *> *)pixelPointBounds
                                 layers:(NSArray<NSString *> *)layers
                                 filter:(NSArray *)filter
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject {
  [self withMapView:reactTag
              block:^(MLRNMapView *view) {
                CGRect rect;

                if (pixelPointBounds == nil) {
                  rect = view.bounds;
                } else {
                  CGFloat left = [pixelPointBounds[0][0] doubleValue];
                  CGFloat top = [pixelPointBounds[0][1] doubleValue];
                  CGFloat right = [pixelPointBounds[1][0] doubleValue];
                  CGFloat bottom = [pixelPointBounds[1][1] doubleValue];

                  rect = CGRectMake(left, top, right - left, bottom - top);
                }

                NSSet *layerIdSet = nil;
                if (layers != nil && layers.count > 0) {
                  layerIdSet = [NSSet setWithArray:layers];
                }

                NSPredicate *predicate = [FilterParser parse:filter];

                [MLRNMapViewManager queryRenderedFeaturesWithRect:view
                                                             rect:rect
                                                         layerIds:layerIdSet
                                                        predicate:predicate
                                                          resolve:resolve
                                                           reject:reject];
              }
             reject:reject
         methodName:@"queryRenderedFeaturesWithBounds"];
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
