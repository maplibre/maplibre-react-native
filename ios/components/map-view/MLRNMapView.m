#import "MLRNMapView.h"

#import "CameraUpdateQueue.h"
#import "MLRNGeoJSONSource.h"
#import "MLRNImageUtils.h"
#import "MLRNImages.h"
#import "MLRNLogging.h"
#import "MLRNMapTouchEvent.h"
#import "MLRNNativeUserLocation.h"
#import "MLRNStyle.h"
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

    // Setup map gesture recognizers
    UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                                action:nil];
    doubleTap.numberOfTapsRequired = 2;

    UITapGestureRecognizer *tap =
        [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didTapMap:)];
    [tap requireGestureRecognizerToFail:doubleTap];

    UILongPressGestureRecognizer *longPress =
        [[UILongPressGestureRecognizer alloc] initWithTarget:self
                                                      action:@selector(didLongPressMap:)];

    // This allows the internal annotation gestures to take precedence over the map tap gesture
    for (int i = 0; i < self.gestureRecognizers.count; i++) {
      UIGestureRecognizer *gestureRecognizer = self.gestureRecognizers[i];

      if ([gestureRecognizer isKindOfClass:[UITapGestureRecognizer class]]) {
        [tap requireGestureRecognizerToFail:gestureRecognizer];
      }
    }

    [self addGestureRecognizer:doubleTap];
    [self addGestureRecognizer:tap];
    [self addGestureRecognizer:longPress];
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

// MARK: - UIGestureRecognizers

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
      NSArray *geoJSONDicts = [MLRNUtils featuresToJSON:hits[source.id]];

      CLLocationCoordinate2D coordinate = [mapView convertPoint:screenPoint
                                           toCoordinateFromView:mapView];

      source.onPress(@{
        @"lngLat" : @[
          [NSNumber numberWithDouble:coordinate.longitude],
          [NSNumber numberWithDouble:coordinate.latitude]
        ],
        @"point" : @[
          [NSNumber numberWithDouble:screenPoint.x], [NSNumber numberWithDouble:screenPoint.y]
        ],
        @"features" : geoJSONDicts,
      });

      return;
    }
  }

  if (mapView.reactOnPress != nil) {
    MLRNMapTouchEvent *event = [MLRNMapTouchEvent makeTapEvent:mapView withPoint:screenPoint];

    self.reactOnPress(event.toJSON);
  }
}

- (void)didLongPressMap:(UILongPressGestureRecognizer *)recognizer {
  MLRNMapView *mapView = (MLRNMapView *)recognizer.view;

  if (mapView == nil || mapView.reactOnPress == nil ||
      recognizer.state != UIGestureRecognizerStateBegan) {
    return;
  }

  MLRNMapTouchEvent *event =
      [MLRNMapTouchEvent makeLongPressEvent:mapView withPoint:[recognizer locationInView:mapView]];
  self.reactOnLongPress(event.toJSON);
}

// MARK: - Prop Setters

- (void)setReactMapStyle:(NSString *)reactMapStyle {
  _reactMapStyle = reactMapStyle;
  [self _removeAllSourcesFromMap];
  self.styleURL = [self _getStyleURLFromKey:_reactMapStyle];
}

- (void)setReactLight:(NSDictionary *)reactLight {
  _reactLight = reactLight;
  [self _applyLight];
}

- (void)_applyLight {
  if (_reactLight == nil || self.style == nil) {
    return;
  }

  MLNLight *light = [[MLNLight alloc] init];
  MLRNStyle *style = [[MLRNStyle alloc] init];
  [style lightLayer:light
      withReactStyle:_reactLight
             isValid:^BOOL {
               return self.style != nil;
             }];
  self.style.light = light;
}

- (void)setReactContentInset:(NSArray<NSNumber *> *)reactContentInset {
  NSNumber *top = [reactContentInset valueForKey:@"top"];
  NSNumber *right = [reactContentInset valueForKey:@"right"];
  NSNumber *bottom = [reactContentInset valueForKey:@"bottom"];
  NSNumber *left = [reactContentInset valueForKey:@"left"];

  self.contentInset =
      UIEdgeInsetsMake(top.floatValue, left.floatValue, bottom.floatValue, right.floatValue);
}

- (void)setReactPreferredFramesPerSecond:(NSInteger)reactPreferredFramesPerSecond {
  if (reactPreferredFramesPerSecond == -1) {
    self.preferredFramesPerSecond = MLNMapViewPreferredFramesPerSecondDefault;
  } else {
    self.preferredFramesPerSecond = reactPreferredFramesPerSecond;
  }
}

- (void)setReactScrollEnabled:(BOOL)reactScrollEnabled {
  _reactScrollEnabled = reactScrollEnabled;
  self.scrollEnabled = _reactScrollEnabled;
}

- (void)setReactZoomEnabled:(BOOL)reactZoomEnabled {
  _reactZoomEnabled = reactZoomEnabled;
  self.zoomEnabled = _reactZoomEnabled;
}

- (void)setReactRotateEnabled:(BOOL)reactRotateEnabled {
  _reactRotateEnabled = reactRotateEnabled;
  self.rotateEnabled = _reactRotateEnabled;
}

- (void)setReactPitchEnabled:(BOOL)reactPitchEnabled {
  _reactPitchEnabled = reactPitchEnabled;
  self.pitchEnabled = _reactPitchEnabled;
}

- (void)setReactAttributionEnabled:(BOOL)reactAttributionEnabled {
  _reactAttributionEnabled = reactAttributionEnabled;
  self.attributionButton.hidden = !_reactAttributionEnabled;
}

- (void)setReactAttributionPosition:(NSDictionary<NSString *, NSNumber *> *)position {
  __weak typeof(self) weakSelf = self;
  [self setOrnamentPosition:position
      defaultPosition:MLNOrnamentPositionBottomRight
      setPosition:^(MLNOrnamentPosition ornamentPosition) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setAttributionButtonPosition:ornamentPosition];
      }
      setMargins:^(CGPoint point) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setAttributionButtonMargins:point];
      }];
}

- (void)setReactLogoEnabled:(BOOL)reactLogoEnabled {
  _reactLogoEnabled = reactLogoEnabled;
  self.logoView.hidden = !_reactLogoEnabled;
}

- (void)setReactLogoPosition:(NSDictionary<NSString *, NSNumber *> *)position {
  __weak typeof(self) weakSelf = self;
  [self setOrnamentPosition:position
      defaultPosition:MLNOrnamentPositionBottomLeft
      setPosition:^(MLNOrnamentPosition ornamentPosition) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setLogoViewPosition:ornamentPosition];
      }
      setMargins:^(CGPoint point) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setLogoViewMargins:point];
      }];
}

- (void)setReactCompassEnabled:(BOOL)reactCompassEnabled {
  _reactCompassEnabled = reactCompassEnabled;
  self.compassView.hidden = !_reactCompassEnabled;
}

- (void)setReactCompassPosition:(NSDictionary<NSString *, NSNumber *> *)position {
  __weak typeof(self) weakSelf = self;
  [self setOrnamentPosition:position
      defaultPosition:MLNOrnamentPositionTopRight
      setPosition:^(MLNOrnamentPosition ornamentPosition) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setCompassViewPosition:ornamentPosition];
      }
      setMargins:^(CGPoint point) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        [strongSelf setCompassViewMargins:point];
      }];
}

- (void)setReactCompassHiddenFacingNorth:(BOOL)reactCompassHiddenFacingNorth {
  _reactCompassHiddenFacingNorth = reactCompassHiddenFacingNorth;
  self.compassView.compassVisibility =
      _reactCompassHiddenFacingNorth ? MLNOrnamentVisibilityAdaptive : MLNOrnamentVisibilityVisible;
}

- (void)setReactShowUserLocation:(BOOL)reactShowUserLocation {
  self.showsUserLocation = reactShowUserLocation;
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

- (NSArray<MLRNGeoJSONSource *> *)getAllShapeSources {
  NSMutableArray<MLRNSource *> *shapeSources = [[NSMutableArray alloc] init];

  for (MLRNSource *source in _sources) {
    if ([source isKindOfClass:[MLRNGeoJSONSource class]]) {
      [shapeSources addObject:(MLRNGeoJSONSource *)source];
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
  NSDictionary *viewState = [self makeViewState:mapView animated:animated];

  self.reactOnRegionWillChange(viewState);
}

- (void)mapViewRegionIsChanging:(MLNMapView *)mapView {
  NSDictionary *viewState = [self makeViewState:mapView animated:false];

  self.reactOnRegionIsChanging(viewState);
}

- (void)mapView:(MLNMapView *)mapView
    regionDidChangeWithReason:(MLNCameraChangeReason)reason
                     animated:(BOOL)animated {
  if (((reason & MLNCameraChangeReasonTransitionCancelled) ==
       MLNCameraChangeReasonTransitionCancelled) &&
      ((reason & MLNCameraChangeReasonGesturePan) != MLNCameraChangeReasonGesturePan))
    return;

  ((MLRNMapView *)mapView).isUserInteraction = (BOOL)(reason & ~MLNCameraChangeReasonProgrammatic);

  NSDictionary *viewState = [self makeViewState:mapView animated:animated];

  self.reactOnRegionDidChange(viewState);
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

  for (int i = 0; i < reactMapView.sources.count; i++) {
    MLRNSource *source = reactMapView.sources[i];
    source.map = reactMapView;
  }
  for (int i = 0; i < reactMapView.layers.count; i++) {
    MLRNLayer *layer = reactMapView.layers[i];
    layer.map = reactMapView;
  }

  [reactMapView _applyLight];
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

// MARK: - Helper Functions

- (void)setOrnamentPosition:(NSDictionary<NSString *, NSNumber *> *)position
            defaultPosition:(MLNOrnamentPosition)defaultPosition
                setPosition:(void (^)(MLNOrnamentPosition))setViewPosition
                 setMargins:(void (^)(CGPoint))setViewMargins {
  NSNumber *topNumber = [position valueForKey:@"top"];
  NSNumber *rightNumber = [position valueForKey:@"right"];
  NSNumber *bottomNumber = [position valueForKey:@"bottom"];
  NSNumber *leftNumber = [position valueForKey:@"left"];

  NSInteger top = [topNumber integerValue];
  NSInteger right = [rightNumber integerValue];
  NSInteger bottom = [bottomNumber integerValue];
  NSInteger left = [leftNumber integerValue];

  if (left != -1 && top != -1) {
    setViewPosition(MLNOrnamentPositionTopLeft);
    setViewMargins(CGPointMake(left, top));
  } else if (right != -1 && top != -1) {
    setViewPosition(MLNOrnamentPositionTopRight);
    setViewMargins(CGPointMake(right, top));
  } else if (bottom != -1 && right != -1) {
    setViewPosition(MLNOrnamentPositionBottomRight);
    setViewMargins(CGPointMake(right, bottom));
  } else if (bottom != -1 && left != -1) {
    setViewPosition(MLNOrnamentPositionBottomLeft);
    setViewMargins(CGPointMake(left, bottom));
  } else {
    setViewPosition(defaultPosition);
    // Equals MLNOrnamentDefaultPositionOffset in MLNMapView.mm
    setViewMargins(CGPointMake(8, 8));
  }
}

- (NSDictionary *)makeViewState:(MLNMapView *)mapView animated:(BOOL)animated {
  MLRNMapView *rctMapView = (MLRNMapView *)mapView;

  NSDictionary *viewState = @{
    @"center" : @[
      [NSNumber numberWithDouble:mapView.centerCoordinate.longitude],
      [NSNumber numberWithDouble:mapView.centerCoordinate.latitude]
    ],
    @"zoom" : [NSNumber numberWithDouble:mapView.zoomLevel],
    @"pitch" : [NSNumber numberWithDouble:mapView.camera.pitch],
    @"bearing" : [NSNumber numberWithDouble:mapView.camera.heading],
    @"bounds" : [MLRNUtils fromCoordinateBounds:mapView.visibleCoordinateBounds],
    @"animated" : [NSNumber numberWithBool:animated],
    @"userInteraction" : @(rctMapView.isUserInteraction),
  };

  return viewState;
}

@end
