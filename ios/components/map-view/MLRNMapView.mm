#import "MLRNMapView.h"

#import "CameraUpdateQueue.h"
#import "MLRNEventTypes.h"
#import "MLRNImageUtils.h"
#import "MLRNImages.h"
#import "MLRNLogging.h"
#import "MLRNMapTouchEvent.h"
#import "MLRNNativeUserLocation.h"
#import "MLRNShapeSource.h"
#import "MLRNUserLocation.h"
#import "MLRNUtils.h"

@implementation MLRNMapView {
  BOOL _pendingInitialLayout;
}

static double const DEG2RAD = M_PI / 180;
static double const LAT_MAX = 85.051128779806604;
static double const TILE_SIZE = 256;
static double const EARTH_RADIUS_M = 6378137;
static double const M2PI = M_PI * 2;

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.delegate = self;

    _pendingInitialLayout = YES;
    _cameraUpdateQueue = [[CameraUpdateQueue alloc] init];
    _sources = [[NSMutableArray alloc] init];
    _images = [[NSMutableArray alloc] init];
    _layers = [[NSMutableArray alloc] init];
    _pointAnnotations = [[NSMutableArray alloc] init];
    _reactSubviews = [[NSMutableArray alloc] init];
    _layerWaiters = [[NSMutableDictionary alloc] init];
    _styleWaiters = [[NSMutableArray alloc] init];
    _logging = [[MLRNLogging alloc] init];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  if (_pendingInitialLayout) {
    _pendingInitialLayout = NO;

    [_reactCamera initialLayout];
  }
}

- (void)invalidate {
  if (_reactSubviews.count == 0) {
    return;
  }
  for (int i = 0; i < _reactSubviews.count; i++) {
    [self removeFromMap:_reactSubviews[i]];
  }
}

- (void)layerAdded:(MLNStyleLayer *)layer {
  NSString *layerId = layer.identifier;
  NSMutableArray *waiters = [_layerWaiters valueForKey:layerId];
  if (waiters) {
    for (FoundLayerBlock foundLayerBlock in waiters) {
      foundLayerBlock(layer);
    }
    [_layerWaiters removeObjectForKey:layerId];
  }
}

- (void)waitForLayerWithId:(nonnull NSString *)layerId
                      then:(void (^)(MLNStyleLayer *layer))foundLayer {
  if (self.style) {
    MLNStyleLayer *layer = [self.style layerWithIdentifier:layerId];
    if (layer) {
      foundLayer(layer);
    } else {
      NSMutableArray *existingWaiters = [_layerWaiters valueForKey:layerId];

      NSMutableArray *waiters = existingWaiters;
      if (waiters == nil) {
        waiters = [[NSMutableArray alloc] init];
      }
      [waiters addObject:foundLayer];
      if (!existingWaiters) {
        [_layerWaiters setObject:waiters forKey:layerId];
      }
    }
  } else {
    // TODO
  }
}

- (void)getStyle:(void (^)(MLNStyle *style))onStyleLoaded {
  if (self.style) {
    onStyleLoaded(self.style);
  } else {
    [_styleWaiters addObject:onStyleLoaded];
  }
}

- (void)notifyStyleLoaded {
  if (!self.style) return;
  for (StyleLoadedBlock styleLoadedBlock in self.styleWaiters) {
    styleLoadedBlock(self.style);
  }
  [self.styleWaiters removeAllObjects];
}

- (void)addToMap:(UIView *)subview {
  if ([subview isKindOfClass:[MLRNSource class]]) {
    MLRNSource *source = (MLRNSource *)subview;
    source.map = self;
    [_sources addObject:(MLRNSource *)subview];
  } else if ([subview isKindOfClass:[MLRNLight class]]) {
    MLRNLight *light = (MLRNLight *)subview;
    _light = light;
    _light.map = self;
  } else if ([subview isKindOfClass:[MLRNNativeUserLocation class]]) {
    MLRNNativeUserLocation *nativeUserLocation = (MLRNNativeUserLocation *)subview;
    nativeUserLocation.map = self;
  } else if ([subview isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *pointAnnotation = (MLRNPointAnnotation *)subview;
    pointAnnotation.map = self;
    [_pointAnnotations addObject:pointAnnotation];
  } else if ([subview isKindOfClass:[MLRNCamera class]]) {
    MLRNCamera *camera = (MLRNCamera *)subview;
    camera.map = self;
  } else if ([subview isKindOfClass:[MLRNImages class]]) {
    MLRNImages *images = (MLRNImages *)subview;
    images.map = self;
    [_images addObject:images];
  } else if ([subview isKindOfClass:[MLRNLayer class]]) {
    MLRNLayer *layer = (MLRNLayer *)subview;
    layer.map = self;
    [_layers addObject:layer];
  } else {
    NSArray<UIView *> *childSubviews = [subview subviews];

    for (int i = 0; i < childSubviews.count; i++) {
      [self addToMap:childSubviews[i]];
    }
  }
}

- (void)removeFromMap:(UIView *)subview {
  if ([subview isKindOfClass:[MLRNSource class]]) {
    MLRNSource *source = (MLRNSource *)subview;
    source.map = nil;
    [_sources removeObject:source];
  } else if ([subview isKindOfClass:[MLRNPointAnnotation class]]) {
    MLRNPointAnnotation *pointAnnotation = (MLRNPointAnnotation *)subview;
    pointAnnotation.map = nil;
    [_pointAnnotations removeObject:pointAnnotation];
  } else if ([subview isKindOfClass:[MLRNCamera class]]) {
    MLRNCamera *camera = (MLRNCamera *)subview;
    camera.map = nil;
  } else if ([subview isKindOfClass:[MLRNImages class]]) {
    MLRNImages *images = (MLRNImages *)subview;
    images.map = nil;
    [_images removeObject:images];
  } else if ([subview isKindOfClass:[MLRNLayer class]]) {
    MLRNLayer *layer = (MLRNLayer *)subview;
    layer.map = nil;
    [_layers removeObject:layer];
  } else if ([subview isKindOfClass:[MLRNNativeUserLocation class]]) {
    MLRNNativeUserLocation *nativeUserLocation = (MLRNNativeUserLocation *)subview;
    nativeUserLocation.map = nil;
  } else if ([subview isKindOfClass:[MLRNLight class]]) {
    MLRNLight *light = (MLRNLight *)subview;
    light.map = nil;
  } else {
    NSArray<UIView *> *childSubViews = [subview subviews];

    for (int i = 0; i < childSubViews.count; i++) {
      [self removeFromMap:childSubViews[i]];
    }
  }
  if ([_layerWaiters count] > 0) {
    RCTLogWarn(@"The following layers were waited on but never added to the map: %@",
               [_layerWaiters allKeys]);
    [_layerWaiters removeAllObjects];
  }
}

- (void)setSourceVisibility:(BOOL)visible
                   sourceId:(NSString *)sourceId
              sourceLayerId:(NSString *)sourceLayerId {
  __weak __typeof__(self) weakSelf = self;
  [self getStyle:^(MLNStyle *style) {
    __strong __typeof__(self) strongSelf = weakSelf;
    for (MLNStyleLayer *layer in strongSelf.style.layers) {
      if ([layer isKindOfClass:[MLNForegroundStyleLayer class]]) {
        MLNForegroundStyleLayer *foregroundLayer = (MLNForegroundStyleLayer *)layer;
        if (![foregroundLayer.sourceIdentifier isEqualToString:sourceId]) continue;
        if (sourceLayerId == nil || sourceLayerId.length == 0) {
          layer.visible = visible;
        } else if ([layer isKindOfClass:[MLNVectorStyleLayer class]]) {
          MLNVectorStyleLayer *vectorLayer = (MLNVectorStyleLayer *)layer;
          if ([vectorLayer.sourceLayerIdentifier isEqualToString:sourceLayerId]) {
            layer.visible = visible;
          }
        }
      }
    }
  }];
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  [self addToMap:subview];
  [_reactSubviews insertObject:(UIView *)subview atIndex:(NSUInteger)atIndex];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (void)removeReactSubview:(UIView *)subview {
  // similarly, when the children are being removed we have to do the appropriate
  // underlying mapview action here.
  [self removeFromMap:subview];
  [_reactSubviews removeObject:(UIView *)subview];
  [(UIView *)subview removeFromSuperview];
}
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-missing-super-calls"
- (NSArray<UIView *> *)reactSubviews {
  return _reactSubviews;
}
#pragma clang diagnostic pop

// MARK: - Prop Setters

- (void)setReactZoomEnabled:(BOOL)reactZoomEnabled {
  _reactZoomEnabled = reactZoomEnabled;
  self.zoomEnabled = _reactZoomEnabled;
}

- (void)setReactScrollEnabled:(BOOL)reactScrollEnabled {
  _reactScrollEnabled = reactScrollEnabled;
  self.scrollEnabled = _reactScrollEnabled;
}

- (void)setReactPitchEnabled:(BOOL)reactPitchEnabled {
  _reactPitchEnabled = reactPitchEnabled;
  self.pitchEnabled = _reactPitchEnabled;
}

- (void)setReactRotateEnabled:(BOOL)reactRotateEnabled {
  _reactRotateEnabled = reactRotateEnabled;
  self.rotateEnabled = _reactRotateEnabled;
}

- (void)setReactAttributionEnabled:(BOOL)reactAttributionEnabled {
  _reactAttributionEnabled = reactAttributionEnabled;
  self.attributionButton.hidden = !_reactAttributionEnabled;
}

- (void)setReactAttributionPosition:(NSDictionary<NSString *, NSNumber *> *)position {
  NSNumber *left = [position valueForKey:@"left"];
  NSNumber *right = [position valueForKey:@"right"];
  NSNumber *top = [position valueForKey:@"top"];
  NSNumber *bottom = [position valueForKey:@"bottom"];
  if (left != nil && top != nil) {
    [self setAttributionButtonPosition:MLNOrnamentPositionTopLeft];
    [self setAttributionButtonMargins:CGPointMake([left floatValue], [top floatValue])];
  } else if (right != nil && top != nil) {
    [self setAttributionButtonPosition:MLNOrnamentPositionTopRight];
    [self setAttributionButtonMargins:CGPointMake([right floatValue], [top floatValue])];
  } else if (bottom != nil && right != nil) {
    [self setAttributionButtonPosition:MLNOrnamentPositionBottomRight];
    [self setAttributionButtonMargins:CGPointMake([right floatValue], [bottom floatValue])];
  } else if (bottom != nil && left != nil) {
    [self setAttributionButtonPosition:MLNOrnamentPositionBottomLeft];
    [self setAttributionButtonMargins:CGPointMake([left floatValue], [bottom floatValue])];
  } else {
    [self setAttributionButtonPosition:MLNOrnamentPositionBottomRight];
    // same as MLNOrnamentDefaultPositionOffset in MLNMapView.mm
    [self setAttributionButtonMargins:CGPointMake(8, 8)];
  }
}

- (void)setReactLogoEnabled:(BOOL)reactLogoEnabled {
  _reactLogoEnabled = reactLogoEnabled;
  self.logoView.hidden = !_reactLogoEnabled;
}

- (void)setReactLogoPosition:(NSDictionary<NSString *, NSNumber *> *)logoPosition {
  NSNumber *left = [logoPosition valueForKey:@"left"];
  NSNumber *right = [logoPosition valueForKey:@"right"];
  NSNumber *top = [logoPosition valueForKey:@"top"];
  NSNumber *bottom = [logoPosition valueForKey:@"bottom"];
  if (left != nil && top != nil) {
    [self setLogoViewPosition:MLNOrnamentPositionTopLeft];
    [self setLogoViewMargins:CGPointMake([left floatValue], [top floatValue])];
  } else if (right != nil && top != nil) {
    [self setLogoViewPosition:MLNOrnamentPositionTopRight];
    [self setLogoViewMargins:CGPointMake([right floatValue], [top floatValue])];
  } else if (bottom != nil && right != nil) {
    [self setLogoViewPosition:MLNOrnamentPositionBottomRight];
    [self setLogoViewMargins:CGPointMake([right floatValue], [bottom floatValue])];
  } else if (bottom != nil && left != nil) {
    [self setLogoViewPosition:MLNOrnamentPositionBottomLeft];
    [self setLogoViewMargins:CGPointMake([left floatValue], [bottom floatValue])];
  } else {
    [self setLogoViewPosition:MLNOrnamentPositionBottomRight];
    [self setLogoViewMargins:CGPointMake(8, 8)];
  }
}

- (void)setReactCompassEnabled:(BOOL)reactCompassEnabled {
  _reactCompassEnabled = reactCompassEnabled;
  self.compassView.hidden = !_reactCompassEnabled;
}

- (void)setReactCompassViewPosition:(NSInteger)reactCompassViewPosition {
  if (!self.compassView.hidden) {
    _reactCompassViewPosition = reactCompassViewPosition;
    self.compassViewPosition = (MLNOrnamentPosition)_reactCompassViewPosition;
  }
}

- (void)setReactCompassViewMargins:(CGPoint)reactCompassViewMargins {
  if (!self.compassView.hidden) {
    CGPoint point;
    point = reactCompassViewMargins;
    self.compassViewMargins = point;
  }
}

- (void)setReactShowUserLocation:(BOOL)reactShowUserLocation {
  self.showsUserLocation = reactShowUserLocation;
}

- (void)setReactContentInset:(NSArray<NSNumber *> *)reactContentInset {
  CGFloat top = 0.0f, right = 0.0f, left = 0.0f, bottom = 0.0f;

  if (reactContentInset.count == 4) {
    top = [reactContentInset[0] floatValue];
    right = [reactContentInset[1] floatValue];
    bottom = [reactContentInset[2] floatValue];
    left = [reactContentInset[3] floatValue];
  } else if (reactContentInset.count == 2) {
    top = [reactContentInset[0] floatValue];
    right = [reactContentInset[1] floatValue];
    bottom = [reactContentInset[0] floatValue];
    left = [reactContentInset[1] floatValue];
  } else if (reactContentInset.count == 1) {
    top = [reactContentInset[0] floatValue];
    right = [reactContentInset[0] floatValue];
    bottom = [reactContentInset[0] floatValue];
    left = [reactContentInset[0] floatValue];
  }

  self.contentInset = UIEdgeInsetsMake(top, left, bottom, right);
}

- (void)setReactMapStyle:(NSString *)reactMapStyle {
  _reactMapStyle = reactMapStyle;
  [self _removeAllSourcesFromMap];
  self.styleURL = [self _getStyleURLFromKey:_reactMapStyle];
}

- (void)setReactPreferredFramesPerSecond:(NSInteger)reactPreferredFramesPerSecond {
  self.preferredFramesPerSecond = reactPreferredFramesPerSecond;
}

// MARK: - Methods

- (NSString *)takeSnap:(BOOL)writeToDisk {
  UIGraphicsBeginImageContextWithOptions(self.bounds.size, YES, 0);
  [self drawViewHierarchyInRect:self.bounds afterScreenUpdates:YES];
  UIImage *snapshot = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return writeToDisk ? [MLRNImageUtils createTempFile:snapshot]
                     : [MLRNImageUtils createBase64:snapshot];
}

- (CLLocationDistance)getMetersPerPixelAtLatitude:(double)latitude withZoom:(double)zoomLevel {
  double constrainedZoom =
      [[MLRNUtils clamp:[NSNumber numberWithDouble:zoomLevel]
                    min:[NSNumber numberWithDouble:self.minimumZoomLevel]
                    max:[NSNumber numberWithDouble:self.maximumZoomLevel]] doubleValue];

  double constrainedLatitude = [[MLRNUtils clamp:[NSNumber numberWithDouble:latitude]
                                             min:[NSNumber numberWithDouble:-LAT_MAX]
                                             max:[NSNumber numberWithDouble:LAT_MAX]] doubleValue];

  double constrainedScale = pow(2.0, constrainedZoom);
  return cos(constrainedLatitude * DEG2RAD) * M2PI * EARTH_RADIUS_M /
         (constrainedScale * TILE_SIZE);
}

- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel {
  return [self altitudeFromZoom:zoomLevel atLatitude:self.camera.centerCoordinate.latitude];
}

- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel atLatitude:(CLLocationDegrees)latitude {
  return [self altitudeFromZoom:zoomLevel atLatitude:latitude atPitch:self.camera.pitch];
}

- (CLLocationDistance)altitudeFromZoom:(double)zoomLevel
                            atLatitude:(CLLocationDegrees)latitude
                               atPitch:(CGFloat)pitch {
  return MLNAltitudeForZoomLevel(zoomLevel, pitch, latitude, self.frame.size);
}

- (MLRNPointAnnotation *)getRCTPointAnnotation:(MLNPointAnnotation *)mlnAnnotation {
  for (int i = 0; i < _pointAnnotations.count; i++) {
    MLRNPointAnnotation *rctAnnotation = _pointAnnotations[i];
    if (rctAnnotation.annotation == mlnAnnotation) {
      return rctAnnotation;
    }
  }
  return nil;
}

- (NSArray<MLRNSource *> *)getAllTouchableSources {
  NSMutableArray<MLRNSource *> *touchableSources = [[NSMutableArray alloc] init];

  for (MLRNSource *source in _sources) {
    if (source.hasPressListener) {
      [touchableSources addObject:source];
    }
  }

  return touchableSources;
}

- (NSArray<MLRNImages *> *)getAllImages {
  return [_images copy];
}

- (NSArray<MLRNShapeSource *> *)getAllShapeSources {
  NSMutableArray<MLRNSource *> *shapeSources = [[NSMutableArray alloc] init];

  for (MLRNSource *source in _sources) {
    if ([source isKindOfClass:[MLRNShapeSource class]]) {
      [shapeSources addObject:(MLRNShapeSource *)source];
    }
  }

  return [shapeSources copy];
}
- (MLRNSource *)getTouchableSourceWithHighestZIndex:(NSArray<MLRNSource *> *)touchableSources {
  if (touchableSources == nil || touchableSources.count == 0) {
    return nil;
  }

  if (touchableSources.count == 1) {
    return touchableSources[0];
  }

  NSMutableDictionary<NSString *, MLRNSource *> *layerToSourceDict =
      [[NSMutableDictionary alloc] init];
  for (MLRNSource *touchableSource in touchableSources) {
    NSArray<NSString *> *layerIds = [touchableSource getLayerIDs];

    for (NSString *layerId in layerIds) {
      layerToSourceDict[layerId] = touchableSource;
    }
  }

  NSArray<MLNStyleLayer *> *layers = self.style.layers;
  for (int i = (int)layers.count - 1; i >= 0; i--) {
    MLNStyleLayer *layer = layers[i];

    MLRNSource *source = layerToSourceDict[layer.identifier];
    if (source != nil) {
      return source;
    }
  }

  return nil;
}

- (NSURL *)_getStyleURLFromKey:(NSString *)mapStyle {
  NSURL *url = [NSURL URLWithString:mapStyle];
  if (url) {
    return url;
  } else if (RCTJSONParse(mapStyle, nil)) {
    return [MLRNUtils styleURLFromStyleJSON:mapStyle];
  }
  return url;
}

- (void)_removeAllSourcesFromMap {
  if (self.style == nil || _sources.count == 0) {
    return;
  }
  for (MLRNSource *source in _sources) {
    source.map = nil;
  }
}

- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated {
  [_reactCamera didChangeUserTrackingMode:mode animated:animated];
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
  NSDictionary *payload = [self makeRegionPayload:mapView animated:animated];

  self.reactOnRegionWillChange(payload);
}

- (void)mapViewRegionIsChanging:(MLNMapView *)mapView {
  NSDictionary *payload = [self makeRegionPayload:mapView animated:false];

  self.reactOnRegionIsChanging(payload);
}

- (void)mapView:(MLNMapView *)mapView
    regionDidChangeWithReason:(MLNCameraChangeReason)reason
                     animated:(BOOL)animated {
  if (((reason & MLNCameraChangeReasonTransitionCancelled) ==
       MLNCameraChangeReasonTransitionCancelled) &&
      ((reason & MLNCameraChangeReasonGesturePan) != MLNCameraChangeReasonGesturePan))
    return;

  ((MLRNMapView *)mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);

  NSDictionary *payload = [self makeRegionPayload:mapView animated:animated];

  self.reactOnRegionDidChange(payload);
}

- (void)mapViewWillStartLoadingMap:(MLNMapView *)mapView {
  self.reactOnWillStartLoadingMap(nil);
}

- (void)mapViewDidFinishLoadingMap:(MLNMapView *)mapView {
  self.reactOnDidFinishLoadingMap(nil);
}

- (void)mapViewDidFailLoadingMap:(MLNMapView *)mapView withError:(NSError *)error {
  NSLog(@"Failed loading map %@", error);
  self.reactOnDidFailLoadingMap(nil);
}

- (void)mapViewWillStartRenderingFrame:(MLNMapView *)mapView {
  self.reactOnWillStartRenderingFrame(nil);
}

- (void)mapViewDidFinishRenderingFrame:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered {
  if (fullyRendered) {
    self.reactOnDidFinishRenderingFrameFully(nil);
  } else {
    self.reactOnDidFinishRenderingFrame(nil);
  }
}

- (void)mapViewWillStartRenderingMap:(MLNMapView *)mapView {
  self.reactOnWillStartRenderingMap(nil);
}

- (void)mapViewDidFinishRenderingMap:(MLNMapView *)mapView fullyRendered:(BOOL)fullyRendered {
  if (fullyRendered) {
    self.reactOnDidFinishRenderingMapFully(nil);
  } else {
    self.reactOnDidFinishRenderingMap(nil);
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

  self.reactOnDidFinishLoadingStyle(nil);
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

- (NSDictionary *)makeRegionPayload:(MLNMapView *)mapView animated:(BOOL)animated {
  MLRNMapView *rctMapView = (MLRNMapView *)mapView;
  MLNPointFeature *feature = [[MLNPointFeature alloc] init];
  feature.coordinate = mapView.centerCoordinate;

  feature.attributes = @{
    @"zoomLevel" : [NSNumber numberWithDouble:mapView.zoomLevel],
    @"heading" : [NSNumber numberWithDouble:mapView.camera.heading],
    @"pitch" : [NSNumber numberWithDouble:mapView.camera.pitch],
    @"visibleBounds" : [MLRNUtils fromCoordinateBounds:mapView.visibleCoordinateBounds],
    @"animated" : [NSNumber numberWithBool:animated],
    @"isUserInteraction" : @(rctMapView.isUserInteraction),
  };

  return feature.geoJSONDictionary;
}

@end
