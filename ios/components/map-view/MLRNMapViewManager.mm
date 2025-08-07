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

- (UIView *)view {
  MLRNMapView *mapView = [[MLRNMapView alloc] initWithFrame:[self defaultFrame]];

  // Setup map gesture recognizers
  UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                              action:nil];
  doubleTap.numberOfTapsRequired = 2;

  UITapGestureRecognizer *tap =
      [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didTapMap:)];
  [tap requireGestureRecognizerToFail:doubleTap];

  UILongPressGestureRecognizer *longPress =
      [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(didLongPressMap:)];

  // This allows the internal annotation gestures to take precedents over the map tap gesture
  for (int i = 0; i < mapView.gestureRecognizers.count; i++) {
    UIGestureRecognizer *gestuerReconginer = mapView.gestureRecognizers[i];

    if ([gestuerReconginer isKindOfClass:[UITapGestureRecognizer class]]) {
      [tap requireGestureRecognizerToFail:gestuerReconginer];
    }
  }

  [mapView addGestureRecognizer:doubleTap];
  [mapView addGestureRecognizer:tap];
  [mapView addGestureRecognizer:longPress];

  return mapView;
}

#pragma mark - React View Props

RCT_REMAP_VIEW_PROPERTY(localizeLabels, reactLocalizeLabels, BOOL)
RCT_REMAP_VIEW_PROPERTY(scrollEnabled, reactScrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(pitchEnabled, reactPitchEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(rotateEnabled, reactRotateEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(zoomEnabled, reactZoomEnabled, BOOL)

RCT_REMAP_VIEW_PROPERTY(attribution, reactAttributionEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(attributionPosition, reactAttributionPosition, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(logo, reactLogoEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(logoPosition, reactLogoPosition, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(compass, reactCompassEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(compassPosition, reactCompassPosition, NSDictionary)

RCT_REMAP_VIEW_PROPERTY(contentInset, reactContentInset, NSArray)
RCT_REMAP_VIEW_PROPERTY(mapStyle, reactMapStyle, NSString)
RCT_REMAP_VIEW_PROPERTY(preferredFramesPerSecond, reactPreferredFramesPerSecond, NSInteger)

RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)

#pragma mark - React View Methods

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

+ (void)getVisibleBounds:(MLRNMapView *)view
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  resolve([MLRNUtils fromCoordinateBounds:view.visibleCoordinateBounds]);
}

+ (void)getZoom:(MLRNMapView *)view
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  resolve(@(view.zoomLevel));
}

+ (void)getCenter:(MLRNMapView *)view
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  resolve(@[ @(view.centerCoordinate.longitude), @(view.centerCoordinate.latitude) ]);
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

  NSArray<NSDictionary *> *features = [MLRNMapViewManager featuresToJSON:shapes];

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

#pragma mark - UIGestureRecognizers

- (void)didTapMap:(UITapGestureRecognizer *)recognizer {
  MLRNMapView *mapView = (MLRNMapView *)recognizer.view;
  CGPoint screenPoint = [recognizer locationInView:mapView];
  NSArray<MLRNSource *> *touchableSources = [mapView getAllTouchableSources];

  NSMutableDictionary<NSString *, NSArray<id<MLNFeature>> *> *hits =
      [[NSMutableDictionary alloc] init];
  NSMutableArray<MLRNSource *> *hitTouchableSources = [[NSMutableArray alloc] init];
  for (MLRNSource *touchableSource in touchableSources) {
    NSDictionary<NSString *, NSNumber *> *hitbox = touchableSource.hitbox;
    float halfWidth = [hitbox[@"width"] floatValue] / 2.f;
    float halfHeight = [hitbox[@"height"] floatValue] / 2.f;

    CGFloat top = screenPoint.y - halfHeight;
    CGFloat left = screenPoint.x - halfWidth;
    CGRect hitboxRect =
        CGRectMake(left, top, [hitbox[@"width"] floatValue], [hitbox[@"height"] floatValue]);

    NSArray<id<MLNFeature>> *features =
        [mapView visibleFeaturesInRect:hitboxRect
            inStyleLayersWithIdentifiers:[NSSet setWithArray:[touchableSource getLayerIDs]]
                               predicate:nil];

    if (features.count > 0) {
      hits[touchableSource.id] = features;
      [hitTouchableSources addObject:touchableSource];
    }
  }

  if (hits.count > 0) {
    MLRNSource *source = [mapView getTouchableSourceWithHighestZIndex:hitTouchableSources];
    if (source != nil && source.hasPressListener) {
      NSArray *geoJSONDicts = [MLRNMapViewManager featuresToJSON:hits[source.id]];

      NSString *eventType = RCT_MLRN_VECTOR_SOURCE_LAYER_PRESS;
      if ([source isKindOfClass:[MLRNShapeSource class]]) {
        eventType = RCT_MLRN_SHAPE_SOURCE_LAYER_PRESS;
      }

      CLLocationCoordinate2D coordinate = [mapView convertPoint:screenPoint
                                           toCoordinateFromView:mapView];

      MLRNEvent *event =
          [MLRNEvent makeEvent:eventType
                   withPayload:@{
                     @"features" : geoJSONDicts,
                     @"point" : @{
                       @"x" : [NSNumber numberWithDouble:screenPoint.x],
                       @"y" : [NSNumber numberWithDouble:screenPoint.y]
                     },
                     @"coordinates" : @{
                       @"latitude" : [NSNumber numberWithDouble:coordinate.latitude],
                       @"longitude" : [NSNumber numberWithDouble:coordinate.longitude]
                     }
                   }];
      [self fireEvent:event withCallback:source.onPress];
      return;
    }
  }

  if (mapView.onPress == nil) {
    return;
  }

  MLRNMapTouchEvent *event = [MLRNMapTouchEvent makeTapEvent:mapView withPoint:screenPoint];
  [self fireEvent:event withCallback:mapView.onPress];
}

- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer {
  MLRNMapView *mapView = (MLRNMapView *)recognizer.view;

  if (mapView == nil || mapView.onPress == nil ||
      recognizer.state != UIGestureRecognizerStateBegan) {
    return;
  }

  MLRNMapTouchEvent *event =
      [MLRNMapTouchEvent makeLongPressEvent:mapView withPoint:[recognizer locationInView:mapView]];
  [self fireEvent:event withCallback:mapView.onLongPress];
}

+ (NSArray<NSDictionary *> *)featuresToJSON:(NSArray<id<MLNFeature>> *)features {
  NSMutableArray<NSDictionary *> *json = [[NSMutableArray alloc] init];
  for (id<MLNFeature> feature in features) {
    [json addObject:feature.geoJSONDictionary];
  }
  return json;
}

@end
