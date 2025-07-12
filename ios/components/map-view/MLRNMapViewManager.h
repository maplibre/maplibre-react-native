#import <MapLibre/MapLibre.h>
#import "ViewManager.h"

@interface MLRNMapViewManager : ViewManager

- (void)didTapMap:(UITapGestureRecognizer *)recognizer;

- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer;

+ (void)getPointInView:(MLRNMapView *)view
          atCoordinate:(NSArray<NSNumber *> *)atCoordinate
              resolver:(RCTPromiseResolveBlock)resolve
              rejecter:(RCTPromiseRejectBlock)reject;

+ (void)getCoordinateFromView:(MLRNMapView *)view
                      atPoint:(CGPoint)atPoint
                     resolver:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject;

+ (void)takeSnap:(MLRNMapView *)view
     writeToDisk:(BOOL)writeToDisk
        resolver:(RCTPromiseResolveBlock)resolve
        rejecter:(RCTPromiseRejectBlock)reject;

+ (void)getVisibleBounds:(MLRNMapView *)view
                resolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject;

+ (void)getZoom:(MLRNMapView *)view
       resolver:(RCTPromiseResolveBlock)resolve
       rejecter:(RCTPromiseRejectBlock)reject;

+ (void)getCenter:(MLRNMapView *)view
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject;

@end
