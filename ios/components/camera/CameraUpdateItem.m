#import "CameraUpdateItem.h"
#import "CameraMode.h"

@interface MLNMapView (FlyToWithPadding)
- (void)_flyToCamera:(MLNMapCamera *)camera
          edgePadding:(UIEdgeInsets)insets
         withDuration:(NSTimeInterval)duration
         peakAltitude:(CLLocationDistance)peakAltitude
    completionHandler:(nullable void (^)(void))completion;
@end

@interface MLRNCameraWithPadding : MLNMapCamera

@property (nonatomic) MLNMapCamera *_Nonnull camera;
@property (nonatomic) UIEdgeInsets boundsPadding;

@end

@implementation MLRNCameraWithPadding

@end

@implementation CameraUpdateItem

- (void)execute:(MLRNMapView *)mapView withCompletionHandler:(void (^)(void))completionHandler {
  if (_cameraStop.mode == [NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_FLIGHT]) {
    [self _flyToCamera:mapView withCompletionHandler:completionHandler];
  } else if (_cameraStop.mode == [NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_EASE]) {
    [self _moveCamera:mapView animated:YES ease:YES withCompletionHandler:completionHandler];
  } else if (_cameraStop.mode == [NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_LINEAR]) {
    [self _moveCamera:mapView animated:YES ease:NO withCompletionHandler:completionHandler];
  } else {
    [self _moveCamera:mapView animated:NO ease:NO withCompletionHandler:completionHandler];
  }
}

- (void)_flyToCamera:(MLRNMapView *)mapView
    withCompletionHandler:(void (^)(void))completionHandler {
  MLRNCameraWithPadding *nextCamera = [self _makeCamera:mapView];

  if ([mapView respondsToSelector:@selector
               (_flyToCamera:edgePadding:withDuration:peakAltitude:completionHandler:)]) {
    [mapView _flyToCamera:nextCamera.camera
              edgePadding:nextCamera.boundsPadding
             withDuration:_cameraStop.duration
             peakAltitude:-1
        completionHandler:completionHandler];
  } else {
    [mapView flyToCamera:nextCamera.camera
             withDuration:_cameraStop.duration
        completionHandler:completionHandler];
  }
}

- (void)_moveCamera:(MLRNMapView *)mapView
                 animated:(BOOL)animated
                     ease:(BOOL)ease
    withCompletionHandler:(void (^)(void))completionHandler {
  MLRNCameraWithPadding *nextCamera = [self _makeCamera:mapView];
  NSString *easeFunctionName =
      ease ? kCAMediaTimingFunctionEaseInEaseOut : kCAMediaTimingFunctionLinear;

  [mapView setCamera:nextCamera.camera
                 withDuration:animated ? _cameraStop.duration : 0
      animationTimingFunction:[CAMediaTimingFunction functionWithName:easeFunctionName]
                  edgePadding:nextCamera.boundsPadding
            completionHandler:completionHandler];
}

- (MLRNCameraWithPadding *)_makeCamera:(MLRNMapView *)mapView {
  MLNMapCamera *nextCamera = [mapView.camera copy];

  UIEdgeInsets padding = [self _clippedPadding:_cameraStop.padding forView:mapView];
  if (padding.top <= 0 && padding.bottom <= 0) {
    // If all padding properties are 0 in the update, and the bounds and centerCoordinate do not
    // change, the padding doesn't change either. This seems to be a bug in the iOS SDK.
    padding.top = 1.0;
    padding.bottom = 1.0;
  }

  bool hasSetAltitude = false;

  if ([self _isCoordValid:_cameraStop.coordinate]) {
    MLNCoordinateBounds boundsFromCoord = {.sw = _cameraStop.coordinate,
                                           .ne = _cameraStop.coordinate};
    MLNMapCamera *boundsCamera = [mapView camera:nextCamera
                         fittingCoordinateBounds:boundsFromCoord
                                     edgePadding:padding];
    nextCamera.centerCoordinate = boundsCamera.centerCoordinate;
  } else if ([self _areBoundsValid:_cameraStop.bounds]) {
    MLNMapCamera *boundsCamera = [mapView camera:nextCamera
                         fittingCoordinateBounds:_cameraStop.bounds
                                     edgePadding:padding];
    nextCamera.centerCoordinate = boundsCamera.centerCoordinate;
    nextCamera.altitude = boundsCamera.altitude;
    hasSetAltitude = true;
  }

  if (_cameraStop.pitch != nil) {
    nextCamera.pitch = [_cameraStop.pitch floatValue];
  }

  if (_cameraStop.heading != nil) {
    nextCamera.heading = [_cameraStop.heading floatValue];
  }

  if (_cameraStop.zoom != nil && hasSetAltitude == false) {
    nextCamera.altitude = [mapView altitudeFromZoom:[_cameraStop.zoom doubleValue]
                                         atLatitude:nextCamera.centerCoordinate.latitude
                                            atPitch:nextCamera.pitch];
  }

  MLRNCameraWithPadding *cameraWithPadding = [[MLRNCameraWithPadding alloc] init];
  cameraWithPadding.camera = nextCamera;
  cameraWithPadding.boundsPadding = padding;
  return cameraWithPadding;
}

- (UIEdgeInsets)_clippedPadding:(UIEdgeInsets)padding forView:(MLRNMapView *)mapView {
  UIEdgeInsets result = padding;
  if ((padding.top + padding.bottom) >= mapView.frame.size.height) {
    double totalPadding = padding.top + padding.bottom;
    double extra = totalPadding - mapView.frame.size.height + 1.0;
    result.top -= (padding.top * extra) / totalPadding;
    result.bottom -= (padding.bottom * extra) / totalPadding;
  }
  if ((padding.left + padding.right) >= mapView.frame.size.width) {
    double totalPadding = padding.left + padding.right;
    double extra = totalPadding - mapView.frame.size.width + 1.0;
    result.left -= (padding.left * extra) / totalPadding;
    result.right -= (padding.right * extra) / totalPadding;
  }
  return result;
}

- (BOOL)_areBoundsValid:(MLNCoordinateBounds)bounds {
  if ([self _isLatitudeValid:bounds.ne.latitude] && [self _isLatitudeValid:bounds.sw.latitude]) {
    return YES;
  }

  return NO;
}

- (BOOL)_isLatitudeValid:(CLLocationDegrees)latitude {
  return latitude >= -90 && latitude <= 90;
}

- (BOOL)_isCoordValid:(CLLocationCoordinate2D)coord {
  BOOL isValid = CLLocationCoordinate2DIsValid(coord);

  if (!isValid) {
    return NO;
  }

  return YES;
}

- (BOOL)_hasCenterCoordAndZoom {
  BOOL isValid = CLLocationCoordinate2DIsValid(_cameraStop.coordinate) && _cameraStop.zoom != nil;

  if (!isValid) {
    return NO;
  }

  return [self _isCoordValid:_cameraStop.coordinate];
}

@end
