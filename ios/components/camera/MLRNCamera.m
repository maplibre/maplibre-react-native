#import "MLRNCamera.h"
#import "CameraMode.h"
#import "CameraStop.h"
#import "CameraUpdateQueue.h"
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "MLRNLocation.h"
#import "MLRNLocationManager.h"
#import "MLRNUtils.h"

@implementation MLRNCamera {
  CameraUpdateQueue *cameraUpdateQueue;
  MLRNCamera *followCamera;
}

- (instancetype)init {
  if (self = [super init]) {
    cameraUpdateQueue = [[CameraUpdateQueue alloc] init];
  }
  return self;
}

- (void)dealloc {
  if (_map) {
    _map.reactCamera = nil;
  }
}

- (void)setMap:(MLRNMapView *)map {
  if (_map != nil) {
    _map.reactCamera = nil;
  }
  _map = map;
  _map.reactCamera = self;

  [self _setInitialCamera];
  [self _updateMinMaxZoom];
  [self _updateMaxBounds];
  [self _updateCamera];
}

- (void)setStop:(NSDictionary<NSString *, id> *)stop {
  _stop = stop;

  [self _updateCamera];
}

- (void)setMinZoom:(NSNumber *)minZoom {
  _minZoom = minZoom;
  [self _updateMinMaxZoom];
}

- (void)setMaxZoom:(NSNumber *)maxZoom {
  _maxZoom = maxZoom;
  [self _updateMinMaxZoom];
}

- (void)setMaxBounds:(NSArray<NSNumber *> *)maxBounds {
  _maxBounds = maxBounds;
  [self _updateMaxBounds];
}

- (void)setTrackUserLocation:(NSString *)trackUserLocation {
  _trackUserLocation = trackUserLocation;

  [self _updateCameraFromTrackUserLocation];
}

- (void)_updateCamera {
  if (_map != nil) {
    if (_trackUserLocation != nil) {
      [self _updateCameraFromTrackUserLocation];
    } else {
      [self _updateCameraFromStop];
    }
  }
}

- (void)_updateCameraFromTrackUserLocation {
  if (_map == nil) {
    return;
  }

  if (_trackUserLocation == nil) {
    _map.userTrackingMode = MLNUserTrackingModeNone;

    return;
  }

  MLNMapCamera *camera = _map.camera;

  if (_stop != nil) {
    if (_stop[@"zoom"] != nil) {
      camera.altitude = [_map altitudeFromZoom:[_stop[@"zoom"] floatValue]];
    }

    if ([self _userTrackingMode] != MLNUserTrackingModeFollowWithCourse &&
        [self _userTrackingMode] != MLNUserTrackingModeFollowWithHeading) {
      if (_stop[@"bearing"] != nil) {
        camera.heading = [_stop[@"bearing"] floatValue];
      }
    }

    if (_stop[@"pitch"] != nil) {
      camera.pitch = [_stop[@"pitch"] floatValue];
    }
  }

  [_map setCamera:camera animated:NO];

  if (_map.userTrackingMode != [self _userTrackingMode]) {
    _map.userTrackingMode = [self _userTrackingMode];
  }
}

- (void)_updateCameraFromStop {
  if (_stop == nil || _trackUserLocation != nil) {
    return;
  }

  if (_map != nil && _map.userTrackingMode != MLNUserTrackingModeNone) {
    _map.userTrackingMode = MLNUserTrackingModeNone;
  }

  [cameraUpdateQueue enqueue:[CameraStop fromDictionary:_stop]];

  [cameraUpdateQueue execute:_map];
}

- (void)_setInitialCamera {
  if (!_initialViewState) {
    return;
  }

  CameraStop *stop = [CameraStop fromDictionary:_initialViewState];
  stop.duration = 0;
  stop.mode = [NSNumber numberWithInt:RCT_MLRN_CAMERA_MODE_NONE];
  CameraUpdateItem *item = [[CameraUpdateItem alloc] init];
  item.cameraStop = stop;
  [item execute:_map
      withCompletionHandler:^{
      }];
}

- (void)_updateMinMaxZoom {
  if (_map != nil) {
    if (_maxZoom) {
      _map.maximumZoomLevel = [_maxZoom doubleValue];
    }
    if (_minZoom) {
      _map.minimumZoomLevel = [_minZoom doubleValue];
    }
  }
}

- (void)_updateMaxBounds {
  if (_map != nil) {
    if (_maxBounds) {
      _map.maxBounds = [MLRNUtils fromReactBounds:_maxBounds];
    }
  }
}

- (MLNUserTrackingMode)_userTrackingMode {
  if ([_trackUserLocation isEqualToString:@"default"]) {
    return MLNUserTrackingModeFollow;
  } else if ([_trackUserLocation isEqualToString:@"heading"]) {
    return MLNUserTrackingModeFollowWithHeading;
  } else if ([_trackUserLocation isEqualToString:@"course"]) {
    return MLNUserTrackingModeFollowWithCourse;
  } else {
    return MLNUserTrackingModeNone;
  }
}

- (id)_trackingModeToString:(MLNUserTrackingMode)mode {
  switch (mode) {
    case MLNUserTrackingModeFollow:
      return @"default";
    case MLNUserTrackingModeFollowWithHeading:
      return @"heading";
    case MLNUserTrackingModeFollowWithCourse:
      return @"course";
    case MLNUserTrackingModeNone:
      return [NSNull null];
  }
}

- (void)initialLayout {
  [self _setInitialCamera];
  [self _updateCamera];
}

- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated {
  NSDictionary *payload = @{
    @"trackuserLocation" : [self _trackingModeToString:mode],
  };

  self.onTrackUserLocationChange(payload);
}

@end
