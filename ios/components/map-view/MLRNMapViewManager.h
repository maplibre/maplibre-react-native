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

+ (void)project:(MLRNMapView *_Nonnull)view
     coordinate:(CLLocationCoordinate2D)coordinate
        resolve:(RCTPromiseResolveBlock _Nonnull)resolve
         reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)unproject:(MLRNMapView *_Nonnull)view
            point:(CGPoint)point
          resolve:(RCTPromiseResolveBlock _Nonnull)resolve
           reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)takeSnap:(MLRNMapView *_Nonnull)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock _Nonnull)resolve
          reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)queryRenderedFeaturesWithCoordinate:(MLRNMapView *_Nonnull)view
                                 coordinate:(CLLocationCoordinate2D)coordinate
                                   layerIds:(NSSet *_Nonnull)layerIds
                                  predicate:(NSPredicate *_Nonnull)predicate
                                    resolve:(RCTPromiseResolveBlock _Nonnull)resolve
                                     reject:(RCTPromiseRejectBlock _Nonnull)reject;

+ (void)queryRenderedFeaturesWithBounds:(MLRNMapView *_Nonnull)view
                                 bounds:(MLNCoordinateBounds)bounds
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
