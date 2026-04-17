#import "MLRNPointAnnotation.h"
#import <React/UIView+React.h>
#import "MLRNMapTouchEvent.h"
#import "MLRNMapView.h"
#import "MLRNUtils.h"

const float CENTER_X_OFFSET_BASE = -0.5f;
const float CENTER_Y_OFFSET_BASE = -0.5f;

@implementation MLRNPointAnnotation {
  UITapGestureRecognizer *customViewTap;
  // Finger-to-anchor offset to preserve the touch position relative to the annotation's anchor
  CGPoint _dragFingerOffset;
  BOOL _dragFingerOffsetCaptured;
}

- (id)init {
  if (self = [super init]) {
    customViewTap = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                            action:@selector(_handleTap:)];
  }
  return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  if ([subview isKindOfClass:[MLRNCallout class]]) {
    self.calloutView = (MLRNCallout *)subview;
    self.calloutView.representedObject = self;
  } else {
    [super insertReactSubview:subview atIndex:0];
  }
}

- (void)removeReactSubview:(UIView *)subview {
  if ([subview isKindOfClass:[MLRNCallout class]]) {
    self.calloutView = nil;
  } else {
    [super removeReactSubview:subview];
  }
}

- (void)reactSetFrame:(CGRect)frame {
  // Skip frame updates while dragging
  if (self.dragState != MLNAnnotationViewDragStateNone) {
    return;
  }

  if ([_map.annotations containsObject:self]) {
    [_map removeAnnotation:self];
  }
  [super reactSetFrame:frame];
  [self _setCenterOffset:frame];
  [self _addAnnotation];
}

- (void)setAnchor:(NSDictionary<NSString *, NSNumber *> *)anchor {
  _anchor = anchor;
  [self _setCenterOffset:self.frame];
}

- (void)setOffset:(NSDictionary<NSString *, NSNumber *> *)offset {
  _offset = offset;
  [self _setCenterOffset:self.frame];
}

- (void)setCenter:(CGPoint)center {
  // Reset drag offset tracking whenever we're not in a drag
  if (self.dragState == MLNAnnotationViewDragStateNone) {
    _dragFingerOffsetCaptured = NO;
    [super setCenter:center];
    return;
  }

  if (_map != nil) {
    CGPoint coordPoint = [_map convertCoordinate:self.coordinate toPointToView:_map];

    // Reject map-redraw resets: MapLibre re-projects annotations from their
    // coordinate on every redraw, snapping the view back mid-drag.
    if (fabs(center.x - coordPoint.x) < 0.5 && fabs(center.y - coordPoint.y) < 0.5) {
      return;
    }

    // Capture the finger-to-anchor offset so the view doesn't snap its center
    // to the touch point, preserving where the user grabbed relative to the anchor.
    if (!_dragFingerOffsetCaptured) {
      _dragFingerOffset = CGPointMake(center.x - coordPoint.x, center.y - coordPoint.y);
      _dragFingerOffsetCaptured = YES;
    }
    center.x -= _dragFingerOffset.x;
    center.y -= _dragFingerOffset.y;
  }

  [super setCenter:center];
}

- (void)setMap:(MLNMapView *)map {
  if (map == nil) {
    [_map removeAnnotation:self];
    _map = nil;
  } else {
    _map = map;

    // prevents annotations from flying in from the top left corner
    // if the frame hasn't been set yet
    if (![self _isFrameSet]) {
      return;
    }

    [self _addAnnotation];
  }
}

- (void)setReactSelected:(BOOL)reactSelected {
  _reactSelected = reactSelected;

  if (_map != nil) {
    if ([_map isKindOfClass:[MLRNMapView class]]) {
      ((MLRNMapView *)_map).annotationSelected = YES;
    }
    if (_reactSelected) {
      [_map selectAnnotation:self animated:NO completionHandler:nil];
    } else {
      [_map deselectAnnotation:self animated:NO];
    }
  }
}

- (void)setReactDraggable:(BOOL)reactDraggable {
  _reactDraggable = reactDraggable;
  self.draggable = _reactDraggable;
}

- (void)setReactLngLat:(NSArray<NSNumber *> *)reactLngLat {
  _reactLngLat = reactLngLat;
  [self _updateCoordinate];
}

- (NSString *)reuseIdentifier {
  return _id;
}

- (NSString *)title {
  return _reactTitle;
}

- (NSString *)subtitle {
  return _reactSnippet;
}

- (NSString *)toolTip {
  return _reactTitle;
}

- (void)setZIndex:(CGFloat)zIndex {
  _hasExplicitZIndex = YES;
  _explicitZIndex = zIndex;
  self.layer.zPosition = zIndex;
}

- (MLNAnnotationView *)getAnnotationView {
  // Check both reactSubviews (old arch) and customChildCount (Fabric)
  BOOL hasCustomChildren = (self.reactSubviews.count > 0) || (self.customChildCount > 0);

  if (!hasCustomChildren) {
    // Replicate MLNMapView's to allow unified tap/selection behavior.
    NSBundle *mapLibreBundle = [NSBundle bundleForClass:[MLNMapView class]];
    UIImage *pinImage = [UIImage imageNamed:@"default_marker"
                                   inBundle:mapLibreBundle
              compatibleWithTraitCollection:nil];

    UIImageView *pinImageView = [[UIImageView alloc] initWithImage:pinImage];
    [pinImageView sizeToFit];

    MLNAnnotationView *defaultView = [[MLNAnnotationView alloc] initWithReuseIdentifier:nil];
    defaultView.bounds = pinImageView.bounds;
    [defaultView addSubview:pinImageView];
    defaultView.centerOffset = CGVectorMake(0, 0);
    defaultView.enabled = YES;
    [defaultView addGestureRecognizer:customViewTap];
    return defaultView;
  } else {
    // custom view
    self.enabled = YES;
    // Only use latitude-based zPosition if no explicit zIndex was set
    if (!_hasExplicitZIndex) {
      const CGFloat defaultZPosition = 0.0;
      if (self.layer.zPosition == defaultZPosition) {
        self.layer.zPosition = [self _getZPosition];
      }
    }
    [self addGestureRecognizer:customViewTap];
    self.annotation = self;
    return self;
  }
}

- (CGFloat)_getZPosition {
  double latitudeMax = 90.0;
  return latitudeMax - self.coordinate.latitude;
}

- (void)_handleTap:(UITapGestureRecognizer *)recognizer {
  if ([_map isKindOfClass:[MLRNMapView class]]) {
    ((MLRNMapView *)_map).annotationSelected = YES;
  }
  if (self.reactOnPress != nil) {
    self.reactOnPress([self makeEventPayload]);
  }
  [_map selectAnnotation:self animated:NO completionHandler:nil];
}

- (void)_setCenterOffset:(CGRect)frame {
  if (frame.size.width == 0 || frame.size.height == 0) {
    return;
  }

  float dx = 0;
  float dy = 0;

  // Apply anchor offset (anchor is a percentage of view dimensions)
  if (_anchor != nil) {
    float x = [_anchor[@"x"] floatValue];
    float y = [_anchor[@"y"] floatValue];

    dx = -(x * frame.size.width - (frame.size.width / 2));
    dy = -(y * frame.size.height - (frame.size.height / 2));

    // special cases 0 and 1
    if (x == 0) {
      dx = frame.size.width / 2;
    } else if (x == 1) {
      dx = -frame.size.width / 2;
    }

    if (y == 0) {
      dy = frame.size.height / 2;
    } else if (y == 1) {
      dy = -frame.size.height / 2;
    }
  }

  // Apply pixel offset
  if (_offset != nil) {
    dx += [_offset[@"x"] floatValue];
    dy += [_offset[@"y"] floatValue];
  }

  self.centerOffset = CGVectorMake(dx, dy);
}

- (void)_updateCoordinate {
  if (_reactLngLat == nil || _reactLngLat.count < 2) {
    return;
  }

  double lng = [_reactLngLat[0] doubleValue];
  double lat = [_reactLngLat[1] doubleValue];

  dispatch_async(dispatch_get_main_queue(), ^{
    self.coordinate = CLLocationCoordinate2DMake(lat, lng);
  });
}

- (void)_addAnnotation {
  if ([_map.annotations containsObject:self]) {
    return;
  }

  [_map addAnnotation:self];
  if (_reactSelected) {
    [_map selectAnnotation:self animated:NO completionHandler:nil];
  }
}

- (BOOL)_isFrameSet {
  return self.frame.size.width > 0 && self.frame.size.height > 0;
}

- (NSDictionary *)makeEventPayload {
  NSMutableDictionary *payload = [NSMutableDictionary dictionary];
  payload[@"id"] = _id ?: @"";
  payload[@"lngLat"] = @[ @(self.coordinate.longitude), @(self.coordinate.latitude) ];

  CGPoint screenPoint = [_map convertCoordinate:self.coordinate toPointToView:_map];
  payload[@"point"] = @[ @(screenPoint.x), @(screenPoint.y) ];

  return payload;
}

- (void)setDragState:(MLNAnnotationViewDragState)dragState animated:(BOOL)animated {
  [super setDragState:dragState animated:animated];
  switch (dragState) {
    case MLNAnnotationViewDragStateStarting: {
      if (self.reactOnDragStart != nil) {
        self.reactOnDragStart([self makeEventPayload]);
      }
      break;
    }

    case MLNAnnotationViewDragStateDragging:
      if (self.reactOnDrag != nil) {
        self.reactOnDrag([self makeEventPayload]);
      }
      break;

    case MLNAnnotationViewDragStateEnding:
    case MLNAnnotationViewDragStateCanceling: {
      if (self.reactOnDragEnd != nil) {
        self.reactOnDragEnd([self makeEventPayload]);
      }
      break;
    }

    case MLNAnnotationViewDragStateNone:
      return;
  }
}

@end
