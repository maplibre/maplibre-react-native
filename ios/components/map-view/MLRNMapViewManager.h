#import <MapLibre/MapLibre.h>
#import "ViewManager.h"

@interface MLRNMapViewManager : ViewManager <MLNMapViewDelegate>

+ (void)getCenter:(MLRNMapView *_Nonnull)view
          resolve:(RCTPromiseResolveBlock _Nonnull)resolve
           reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getZoom:(MLRNMapView *_Nonnull)view
        resolve:(RCTPromiseResolveBlock _Nonnull)resolve
         reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getBearing:(MLRNMapView *_Nonnull)view
           resolve:(RCTPromiseResolveBlock _Nonnull)resolve
            reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getPitch:(MLRNMapView *_Nonnull)view
         resolve:(RCTPromiseResolveBlock _Nonnull)resolve
          reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getBounds:(MLRNMapView *_Nonnull)view
          resolve:(RCTPromiseResolveBlock _Nonnull)resolve
           reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getViewState:(MLRNMapView *_Nonnull)view
             resolve:(RCTPromiseResolveBlock _Nonnull)resolve
              reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getPointInView:(MLRNMapView *_Nonnull)view
            coordinate:(NSArray<NSNumber *> *_Nonnull)coordinate
               resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)getCoordinateFromView:(MLRNMapView *_Nonnull)view
                        point:(CGPoint)point
                      resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                       reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)takeSnap:(MLRNMapView *_Nonnull)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock _Nonnull)resolve
          reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)queryRenderedFeaturesAtPoint:(MLRNMapView *_Nonnull)view
                               point:(CGPoint)point
                            layerIds:(NSSet *_Nonnull)layerIds
                           predicate:(NSPredicate *_Nonnull)predicate
                             resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                              reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)queryRenderedFeaturesInRect:(MLRNMapView *_Nonnull)view
                               bbox:(CGRect)bbox
                           layerIds:(NSSet *_Nonnull)layerIds
                          predicate:(NSPredicate *_Nonnull)predicate
                            resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                             reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)showAttribution:(MLRNMapView *_Nonnull)view
                resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                 reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)setSourceVisibility:(MLRNMapView *_Nonnull)view
                    visible:(BOOL)visible
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(nullable NSString *)sourceLayerId
                    resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                     reject:(RCTPromiseRejectBlock _Nonnull)reject;

@end
