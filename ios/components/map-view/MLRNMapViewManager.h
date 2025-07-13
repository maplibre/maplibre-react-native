#import <MapLibre/MapLibre.h>
#import "ViewManager.h"

@interface MLRNMapViewManager : ViewManager

- (void)didTapMap:(UITapGestureRecognizer *)recognizer;

- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer;

+ (void)getPointInView:(MLRNMapView *)view
            coordinate:(NSArray<NSNumber *> *)coordinate
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject;

+ (void)getCoordinateFromView:(MLRNMapView *)view
                        point:(CGPoint)point
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject;

+ (void)takeSnap:(MLRNMapView *)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject;

+ (void)getVisibleBounds:(MLRNMapView *)view
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject;

+ (void)getZoom:(MLRNMapView *)view
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;

+ (void)getCenter:(MLRNMapView *)view
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject;

+ (void)queryRenderedFeaturesAtPoint:(MLRNMapView *)view
                               point:(CGPoint)point
                            layerIDs:(NSSet *)layerIDs
                           predicate:(NSPredicate *)predicate
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject;

+ (void)queryRenderedFeaturesInRect:(MLRNMapView *)view
                               bbox:(CGRect)bbox
                           layerIDs:(NSSet *)layerIDs
                          predicate:(NSPredicate *)predicate
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject;

+ (void)showAttribution:(MLRNMapView *)view
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject;

+ (void)setSourceVisibility:(MLRNMapView *)view
                    visible:(BOOL)visible
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(nullable NSString *)sourceLayerId
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject;

- (NSArray<NSDictionary *> *)featuresToJSON:(NSArray<id<MLNFeature>> *)features;

@end
