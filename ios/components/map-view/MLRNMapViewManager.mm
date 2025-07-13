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
#import "MLRNUserLocation.h"
#import "MLRNUtils.h"

@implementation MLRNMapViewManager

RCT_EXPORT_MODULE(MLRNMapView)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// prevents SDK from crashing and cluttering logs
// since we don't have access to the frame right away
- (CGRect)defaultFrame {
  return [[UIScreen mainScreen] bounds];
}

- (UIView *)view {
  MLRNMapView *mapView = [[MLRNMapView alloc] initWithFrame:[self defaultFrame]];
  mapView.delegate = self;

  // setup map gesture recongizers
  UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                              action:nil];
  doubleTap.numberOfTapsRequired = 2;

  UITapGestureRecognizer *tap =
      [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didTapMap:)];
  [tap requireGestureRecognizerToFail:doubleTap];

  UILongPressGestureRecognizer *longPress =
      [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(didLongPressMap:)];

  // this allows the internal annotation gestures to take precedents over the map tap gesture
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
RCT_REMAP_VIEW_PROPERTY(attributionEnabled, reactAttributionEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(attributionPosition, reactAttributionPosition, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(logoEnabled, reactLogoEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(logoPosition, reactLogoPosition, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(compassEnabled, reactCompassEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(zoomEnabled, reactZoomEnabled, BOOL)

RCT_REMAP_VIEW_PROPERTY(compassViewPosition, reactCompassViewPosition, NSInteger *)
RCT_REMAP_VIEW_PROPERTY(compassViewMargins, reactCompassViewMargins, CGPoint)

RCT_REMAP_VIEW_PROPERTY(contentInset, reactContentInset, NSArray)
RCT_REMAP_VIEW_PROPERTY(mapStyle, reactMapStyle, NSString)
RCT_REMAP_VIEW_PROPERTY(preferredFramesPerSecond, reactPreferredFramesPerSecond, NSInteger)

RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMapChange, RCTBubblingEventBlock)

#pragma mark - React Methods

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

      NSString *eventType = RCT_MAPBOX_VECTOR_SOURCE_LAYER_PRESS;
      if ([source isKindOfClass:[MLRNShapeSource class]]) {
        eventType = RCT_MAPBOX_SHAPE_SOURCE_LAYER_PRESS;
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

#pragma mark - MLNMapViewDelegate

- (MLNAnnotationView *)mapView:(MLNMapView *)mapView
             viewForAnnotation:(id<MLNAnnotation>)annotation {
  if ([annotation isKindOfClass:[MLNUserLocation class]] && mapView.userLocation != nil) {
    MLRNMapView *reactMapView = ((MLRNMapView *)mapView);
    if (reactMapView.useNativeUserLocationAnnotationView) {
      return nil;
    }
    return [[MLRNUserLocation sharedInstance] hiddenUserAnnotation];
  } else if ([annotation isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *rctAnnotation = (MLRNPointAnnotation *)annotation;
    return [rctAnnotation getAnnotationView];
  }
  return nil;
}

- (void)mapView:(MLNMapView *)mapView
    didChangeUserTrackingMode:(MLNUserTrackingMode)mode
                     animated:(BOOL)animated {
  MLRNMapView *reactMapView = ((MLRNMapView *)mapView);
  [reactMapView didChangeUserTrackingMode:mode animated:animated];
}

- (void)mapView:(MLNMapView *)mapView didSelectAnnotation:(nonnull id<MLNAnnotation>)annotation {
  if ([annotation isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *rctAnnotation = (MLRNPointAnnotation *)annotation;

    if (rctAnnotation.onSelected != nil) {
      MLRNMapTouchEvent *event = [MLRNMapTouchEvent makeAnnotationTapEvent:rctAnnotation];
      rctAnnotation.onSelected([event toJSON]);
    }
  }
}

- (void)mapView:(MLNMapView *)mapView didDeselectAnnotation:(nonnull id<MLNAnnotation>)annotation {
  if ([annotation isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *rctAnnotation = (MLRNPointAnnotation *)annotation;

    if (rctAnnotation.onDeselected != nil) {
      rctAnnotation.onDeselected(nil);
    }
  }
}

- (BOOL)mapView:(MLNMapView *)mapView annotationCanShowCallout:(id<MLNAnnotation>)annotation {
  if ([annotation isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *rctAnnotation = (MLRNPointAnnotation *)annotation;
    return rctAnnotation.calloutView != nil;
  }
  return NO;
}

- (UIView<MLNCalloutView> *)mapView:(MLNMapView *)mapView
           calloutViewForAnnotation:(id<MLNAnnotation>)annotation {
  if ([annotation isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *rctAnnotation = (MLRNPointAnnotation *)annotation;
    return rctAnnotation.calloutView;
  }
  return nil;
}

- (BOOL)mapView:(MLNMapView *)mapView
    shouldChangeFromCamera:(MLNMapCamera *)oldCamera
                  toCamera:(MLNMapCamera *)newCamera {
  MLRNMapView *reactMapView = ((MLRNMapView *)mapView);
  return MLNCoordinateBoundsIsEmpty(reactMapView.maxBounds) ||
         MLNCoordinateInCoordinateBounds(newCamera.centerCoordinate, reactMapView.maxBounds);
}

- (void)mapView:(MLNMapView *)mapView
    regionWillChangeWithReason:(MLNCameraChangeReason)reason
                      animated:(BOOL)animated {
  ((MLRNMapView *)mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);
  NSDictionary *payload = [self _makeRegionPayload:mapView animated:animated];
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_WILL_CHANGE_EVENT andPayload:payload];
}

- (void)mapViewRegionIsChanging:(MLNMapView *)mapView {
  NSDictionary *payload = [self _makeRegionPayload:mapView animated:false];
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_IS_CHANGING andPayload:payload];
}

- (void)mapView:(MLNMapView *)mapView
    regionDidChangeWithReason:(MLNCameraChangeReason)reason
                     animated:(BOOL)animated {
  if (((reason & MLNCameraChangeReasonTransitionCancelled) ==
       MLNCameraChangeReasonTransitionCancelled) &&
      ((reason & MLNCameraChangeReasonGesturePan) != MLNCameraChangeReasonGesturePan))
    return;

  ((MLRNMapView *)mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);

  NSDictionary *payload = [self _makeRegionPayload:mapView animated:animated];
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_REGION_DID_CHANGE andPayload:payload];
}

- (void)mapViewWillStartLoadingMap:(MLNMapView *)mapView {
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_LOADING_MAP];
}

- (void)mapViewDidFinishLoadingMap:(MLNMapView *)mapView {
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_LOADING_MAP];
}

- (void)mapViewDidFailLoadingMap:(MLNMapView *)mapView withError:(NSError *)error {
  NSLog(@"Failed loading map %@", error);
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FAIL_LOADING_MAP];
}

- (void)mapViewWillStartRenderingFrame:(MLNMapView *)mapView {
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_RENDERING_FRAME];
}

- (void)mapViewDidFinishRenderingFrame:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered {
  if (fullyRendered) {
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_FRAME_FULLY];
  } else {
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINSIH_RENDERING_FRAME];
  }
}

- (void)mapViewWillStartRenderingMap:(MLNMapView *)mapView {
  [self reactMapDidChange:mapView eventType:RCT_MAPBOX_WILL_START_RENDERING_MAP];
}

- (void)mapViewDidFinishRenderingMap:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered {
  if (fullyRendered) {
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_MAP_FULLY];
  } else {
    [self reactMapDidChange:mapView eventType:RCT_MAPBOX_DID_FINISH_RENDERING_MAP];
  }
}

- (void)mapView:(MLNMapView *)mapView didFinishLoadingStyle:(MLNStyle *)style {
  MLRNMapView *reactMapView = (MLRNMapView *)mapView;
  if (reactMapView.reactLocalizeLabels == true) {
    [style localizeLabelsIntoLocale:nil];
  }

  for (int i = 0; i < reactMapView.sources.count; i++) {
    MLRNSource *source = reactMapView.sources[i];
    source.map = reactMapView;
  }
  for (int i = 0; i < reactMapView.layers.count; i++) {
    MLRNLayer *layer = reactMapView.layers[i];
    layer.map = reactMapView;
  }

  if (reactMapView.light != nil) {
    reactMapView.light.map = reactMapView;
  }

  [reactMapView notifyStyleLoaded];
  [self reactMapDidChange:reactMapView eventType:RCT_MAPBOX_DID_FINISH_LOADING_STYLE];
}

- (UIImage *)mapView:(MLNMapView *)mapView didFailToLoadImage:(NSString *)imageName {
  MLRNMapView *reactMapView = ((MLRNMapView *)mapView);
  NSArray<MLRNImages *> *allImages = [reactMapView getAllImages];
  for (MLRNImages *images in allImages) {
    if ([images addMissingImageToStyle:imageName]) {
      // The image was added inside addMissingImageToStyle so we can return nil
      return nil;
    }
  }

  for (MLRNImages *images in allImages) {
    [images sendImageMissingEvent:imageName];
  }
  return nil;
}

- (void)reactMapDidChange:(MLNMapView *)mapView eventType:(NSString *)type {
  [self reactMapDidChange:mapView eventType:type andPayload:nil];
}

- (void)reactMapDidChange:(MLNMapView *)mapView
                eventType:(NSString *)type
               andPayload:(NSDictionary *)payload {
  MLRNMapView *reactMapView = (MLRNMapView *)mapView;
  MLRNEvent *event = [MLRNEvent makeEvent:type withPayload:payload];
  [self fireEvent:event withCallback:reactMapView.onMapChange];
}

- (NSDictionary *)_makeRegionPayload:(MLNMapView *)mapView animated:(BOOL)animated {
  MLRNMapView *rctMapView = (MLRNMapView *)mapView;
  MLNPointFeature *feature = [[MLNPointFeature alloc] init];
  feature.coordinate = mapView.centerCoordinate;
  feature.attributes = @{
    @"zoomLevel" : [NSNumber numberWithDouble:mapView.zoomLevel],
    @"heading" : [NSNumber numberWithDouble:mapView.camera.heading],
    @"pitch" : [NSNumber numberWithDouble:mapView.camera.pitch],
    @"animated" : [NSNumber numberWithBool:animated],
    @"isUserInteraction" : @(rctMapView.isUserInteraction),
    @"visibleBounds" : [MLRNUtils fromCoordinateBounds:mapView.visibleCoordinateBounds]
  };
  return feature.geoJSONDictionary;
}

+ (NSArray<NSDictionary *> *)featuresToJSON:(NSArray<id<MLNFeature>> *)features {
  NSMutableArray<NSDictionary *> *json = [[NSMutableArray alloc] init];
  for (id<MLNFeature> feature in features) {
    [json addObject:feature.geoJSONDictionary];
  }
  return json;
}

@end
