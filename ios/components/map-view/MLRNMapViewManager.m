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
#import "MLRNShapeSource.h"
#import "MLRNUserLocation.h"
#import "MLRNUtils.h"

@implementation MLRNMapViewManager

// MARK: - React View Methods

+ (void)getCenter:(MLRNMapView *)view
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  resolve(@{
    @"longitude" : @(view.centerCoordinate.longitude),
    @"latitude" : @(view.centerCoordinate.latitude)
  });
}

+ (void)getZoom:(MLRNMapView *)view
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  resolve(@(view.zoomLevel));
}

+ (void)getBearing:(MLRNMapView *)view
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  resolve(@(view.camera.heading));
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
  NSDictionary *center = @{
    @"longitude" : @(view.centerCoordinate.longitude),
    @"latitude" : @(view.centerCoordinate.latitude)
  };
  NSNumber *zoom = @(view.zoomLevel);
  NSNumber *bearing = @(view.camera.heading);
  NSNumber *pitch = @(view.camera.pitch);
  NSArray *bounds = [MLRNUtils fromCoordinateBounds:view.visibleCoordinateBounds];

  NSMutableDictionary *payload = [center mutableCopy];
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

  resolve(@{@"locationX" : @(point.x), @"locationY" : @(point.y)});
}

+ (void)unproject:(MLRNMapView *)view
            point:(CGPoint)point
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D coordinate = [view convertPoint:point toCoordinateFromView:view];

  resolve(@{@"longitude" : @(coordinate.longitude), @"latitude" : @(coordinate.latitude)});
}

+ (void)takeSnap:(MLRNMapView *)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  NSString *uri = [view takeSnap:writeToDisk];
  resolve(uri);
}

+ (void)queryRenderedFeaturesWithCoordinate:(MLRNMapView *)view
                                 coordinate:(CLLocationCoordinate2D)coordinate
                                   layerIds:(NSSet *)layerIds
                                  predicate:(NSPredicate *)predicate
                                    resolve:(RCTPromiseResolveBlock)resolve
                                     reject:(RCTPromiseRejectBlock)reject {
  CGPoint point = [self project:view coordinate:coordinate];

  NSArray<id<MLNFeature>> *shapes = [view visibleFeaturesAtPoint:point
                                    inStyleLayersWithIdentifiers:layerIds
                                                       predicate:predicate];

  NSMutableArray<NSDictionary *> *features = [[NSMutableArray alloc] init];
  for (int i = 0; i < shapes.count; i++) {
    [features addObject:shapes[i].geoJSONDictionary];
  }

  resolve(@{@"type" : @"FeatureCollection", @"features" : features});
}

+ (void)queryRenderedFeaturesWithBounds:(MLRNMapView *)view
                                 bounds:(MLNCoordinateBounds)bounds
                               layerIds:(NSSet *)layerIds
                              predicate:(NSPredicate *)predicate
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject {
  CGPoint swPoint = [self project:view coordinate:bounds.sw];
  CGPoint nePoint = [self project:view coordinate:bounds.ne];

  CGRect bbox = CGRectMake(swPoint.x, swPoint.y, nePoint.x - swPoint.x, nePoint.y - swPoint.y);

  NSArray<id<MLNFeature>> *shapes = [view visibleFeaturesInRect:bbox
                                   inStyleLayersWithIdentifiers:layerIds
                                                      predicate:predicate];

  NSArray<NSDictionary *> *features = [MLRNUtils featuresToJSON:shapes];

  resolve(@{@"type" : @"FeatureCollection", @"features" : features});
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
