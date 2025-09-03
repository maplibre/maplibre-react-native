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

RCT_EXPORT_MODULE(MLRNMapView)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// Prevents SDK from crashing and cluttering logs since we don't have access to the frame right away
- (CGRect)defaultFrame {
  return [[UIScreen mainScreen] bounds];
}

#pragma mark - React View Props

RCT_REMAP_VIEW_PROPERTY(mapStyle, reactMapStyle, NSString)
RCT_REMAP_VIEW_PROPERTY(contentInset, reactContentInset, NSArray)
RCT_REMAP_VIEW_PROPERTY(preferredFramesPerSecond, reactPreferredFramesPerSecond, NSInteger)

RCT_REMAP_VIEW_PROPERTY(scrollEnabled, reactScrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(zoomEnabled, reactZoomEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(rotateEnabled, reactRotateEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(pitchEnabled, reactPitchEnabled, BOOL)

RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

RCT_REMAP_VIEW_PROPERTY(attribution, reactAttributionEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(attributionPosition, reactAttributionPosition, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(logo, reactLogoEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(logoPosition, reactLogoPosition, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(compass, reactCompassEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(compassPosition, reactCompassPosition, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)

#pragma mark - React View Methods

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

+ (void)getPointInView:(MLRNMapView *)view
            coordinate:(NSArray<NSNumber *> *)coordinate
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  CGPoint pointInView =
      [view convertCoordinate:CLLocationCoordinate2DMake([coordinate[1] doubleValue],
                                                         [coordinate[0] doubleValue])
                toPointToView:view];

  resolve(@[ @(pointInView.x), @(pointInView.y) ]);
}

+ (void)getCoordinateFromView:(MLRNMapView *)view
                        point:(CGPoint)point
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
  CLLocationCoordinate2D coordinate = [view convertPoint:point toCoordinateFromView:view];

  resolve(@[ @(coordinate.longitude), @(coordinate.latitude) ]);
}

+ (void)takeSnap:(MLRNMapView *)view
     writeToDisk:(BOOL)writeToDisk
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  NSString *uri = [view takeSnap:writeToDisk];
  resolve(uri);
}

+ (void)queryRenderedFeaturesAtPoint:(MLRNMapView *)view
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

  resolve(@{@"type" : @"FeatureCollection", @"features" : features});
}

+ (void)queryRenderedFeaturesInRect:(MLRNMapView *)view
                               bbox:(CGRect)bbox
                           layerIds:(NSSet *)layerIds
                          predicate:(NSPredicate *)predicate
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
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
