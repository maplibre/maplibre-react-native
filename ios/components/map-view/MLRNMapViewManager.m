#import <React/RCTUIManager.h>

#import "CameraStop.h"
#import "CameraUpdateQueue.h"
#import "FilterParser.h"
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "MLRNImages.h"
#import "MLRNMapTouchEvent.h"
#import "MLRNMapView.h"
#import "MLRNMapViewManager.h"
#import "MLRNGeoJSONSource.h"
#import "MLRNUserLocation.h"
#import "MLRNUtils.h"

@implementation MLRNMapViewManager

// MARK: - React View Methods

+ (void)getCenter:(MLRNMapView *)view
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  resolve(@[ @(view.centerCoordinate.longitude), @(view.centerCoordinate.latitude) ]);
}

+ (void)getZoom:(MLRNMapView *)view
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  resolve(@(view.zoomLevel));
}

+ (void)getBearing:(MLRNMapView *)view
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  // Convert -0.0 to 0.0
  resolve(@(view.camera.heading + 0.0));
}

+ (void)getPitch:(MLRNMapView *)view
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  resolve(@(view.camera.pitch));
}

+ (void)getBounds:(MLRNMapView *)view
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  resolve([MLRNUtils fromCoordinateBounds:view.visibleCoordinateBounds]);
}

+ (void)getViewState:(MLRNMapView *)view
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  NSArray *center = @[ @(view.centerCoordinate.longitude), @(view.centerCoordinate.latitude) ];
  NSNumber *zoom = @(view.zoomLevel);
  NSNumber *bearing = @(view.camera.heading);
  NSNumber *pitch = @(view.camera.pitch);
  NSArray *bounds = [MLRNUtils fromCoordinateBounds:view.visibleCoordinateBounds];

  NSMutableDictionary *payload = [NSMutableDictionary dictionary];
  payload[@"center"] = center;
  payload[@"zoom"] = zoom;
  payload[@"bearing"] = bearing;
  payload[@"pitch"] = pitch;
  payload[@"bounds"] = bounds;

  resolve(payload);
}

+ (CGPoint)project:(MLRNMapView *)view coordinate:(CLLocationCoordinate2D)coordinate {
  CGPoint pointInView = [view convertCoordinate:coordinate toPointToView:view];

  return pointInView;
}

+ (void)project:(MLRNMapView *)view
     coordinate:(CLLocationCoordinate2D)coordinate
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  CGPoint point = [self project:view coordinate:coordinate];

  resolve(@[ @(point.x), @(point.y) ]);
}

+ (void)unproject:(MLRNMapView *)view
            point:(CGPoint)point
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D coordinate = [view convertPoint:point toCoordinateFromView:view];

  resolve(@[ @(coordinate.longitude), @(coordinate.latitude) ]);
}

+ (void)createStaticMapImage:(MLRNMapView *)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  NSString *uri = [view takeSnap:writeToDisk];
  resolve(uri);
}

+ (void)queryRenderedFeaturesWithPoint:(MLRNMapView *)view
                                 point:(CGPoint)point
                              layerIds:(NSSet *)layerIds
                             predicate:(NSPredicate *)predicate
                               resolve:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject {
  NSArray<id<MLNFeature>> *shapes = [view visibleFeaturesAtPoint:point
                                    inStyleLayersWithIdentifiers:layerIds
                                                       predicate:predicate];

  NSMutableArray<NSDictionary *> *features = [[NSMutableArray alloc] init];
  for (int i = 0; i < shapes.count; i++) {
    [features addObject:shapes[i].geoJSONDictionary];
  }

  resolve(features);
}

+ (void)queryRenderedFeaturesWithRect:(MLRNMapView *)view
                                 rect:(CGRect)rect
                             layerIds:(NSSet *)layerIds
                            predicate:(NSPredicate *)predicate
                              resolve:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject {
  NSArray<id<MLNFeature>> *shapes = [view visibleFeaturesInRect:rect
                                   inStyleLayersWithIdentifiers:layerIds
                                                      predicate:predicate];

  NSArray<NSDictionary *> *features = [MLRNUtils featuresToJSON:shapes];

  resolve(features);
}

+ (void)showAttribution:(MLRNMapView *)view
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  [view showAttribution:view];
  resolve(nil);
}

+ (void)setSourceVisibility:(MLRNMapView *)view
                    visible:(BOOL)visible
                   sourceId:(nonnull NSString *)sourceId
              sourceLayerId:(nullable NSString *)sourceLayerId
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  [view setSourceVisibility:visible sourceId:sourceId sourceLayerId:sourceLayerId];
  resolve(nil);
}

@end
