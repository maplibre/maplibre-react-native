#import "MLRNCamera.h"
#import "CameraStop.h"
#import "CameraUpdateQueue.h"
#import "MLRNLocation.h"
#import "MLRNUtils.h"
#import "MLRNLocationManager.h"
#import "MLRNEvent.h"
#import "MLRNEventTypes.h"
#import "CameraMode.h"

@implementation MLRNCamera
{
    CameraUpdateQueue *cameraUpdateQueue;
    MLRNCamera *followCamera;
}

- (instancetype)init
{
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

- (void)setMaxZoomLevel:(NSNumber *)maxZoomLevel {
    _maxZoomLevel = maxZoomLevel;
    [self _updateMinMaxZoomLevel];
}

- (void)setMinZoomLevel:(NSNumber *)minZoomLevel {
    _minZoomLevel = minZoomLevel;
    [self _updateMinMaxZoomLevel];
}

- (void)setMaxBounds:(NSString *)maxBounds {
    _maxBounds = maxBounds;
    [self _updateMaxBounds];
}

- (void)setDefaultStop:(NSDictionary<NSString *,id> *)stop
{
    _defaultStop = stop;
}

- (void)setStop:(NSDictionary<NSString *,id> *)stop
{
    _stop = stop;
    
    [self _updateCamera];
}

- (void)setMap:(MLRNMapView *)map
{
    if (_map != nil) {
        _map.reactCamera = nil;
    }
    _map = map;
    _map.reactCamera = self;

    [self _setInitialCamera];
    [self _updateMinMaxZoomLevel];
    [self _updateMaxBounds];
    [self _updateCamera];
}

- (void)setFollowUserLocation:(BOOL)followUserLocation
{
    _followUserLocation = followUserLocation;
    [self _updateCameraFromTrackingMode];
}

- (void)setFollowUserMode:(NSString *)followUserMode
{
    _followUserMode = followUserMode;
    [self _updateCameraFromTrackingMode];
}

- (void)setFollowPitch:(NSNumber *)followPitch
{
    _followPitch = followPitch;
    [self _updateCameraFromTrackingMode];
}

- (void)setFollowZoomLevel:(NSNumber *)followZoomLevel
{
    _followZoomLevel = followZoomLevel;
    [self _updateCameraFromTrackingMode];
}

- (void)setFollowHeading:(NSNumber *)followHeading
{
    _followHeading = followHeading;
    [self _updateCameraFromTrackingMode];
}

- (void)_updateCameraFromJavascript
{
    if (_stop == nil) {
        return;
    }
    
    if (_followUserLocation) {
        return;
    }
    
    if (_map != nil && _map.userTrackingMode != MLNUserTrackingModeNone) {
        _map.userTrackingMode = MLNUserTrackingModeNone;
    }
    if (_stop[@"stops"]) {
        NSArray* stops = _stop[@"stops"];
        for (NSDictionary* stop in stops) {
            [cameraUpdateQueue enqueue:[CameraStop fromDictionary:stop]];
        }
    } else {
        [cameraUpdateQueue enqueue:[CameraStop fromDictionary:_stop]];
    }
    [cameraUpdateQueue execute:_map];
}

- (void)_setInitialCamera
{
    if (! _defaultStop) {
        return;
    }

    CameraStop* stop = [CameraStop fromDictionary:_defaultStop];
    stop.duration = 0;
    stop.mode = [NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_NONE];
    CameraUpdateItem *item = [[CameraUpdateItem alloc] init];
    item.cameraStop = stop;
    [item execute:_map withCompletionHandler:^{ }];
}

- (void)_updateCamera
{
    if (_map != nil) {
        if (_followUserLocation) {
            [self _updateCameraFromTrackingMode];
        } else {
            [self _updateCameraFromJavascript];
        }
    }
}

- (void)_updateMinMaxZoomLevel
{
    if (_map != nil) {
        if (_maxZoomLevel) {
            _map.maximumZoomLevel = [_maxZoomLevel doubleValue];
        }
        if (_minZoomLevel) {
            _map.minimumZoomLevel = [_minZoomLevel doubleValue];
        }
    }
}

- (void)_updateMaxBounds
{
    if (_map != nil) {
        if (_maxBounds) {
            _map.maxBounds = [MLRNUtils fromFeatureCollection:_maxBounds];
        }
    }
}

- (void)_updateCameraFromTrackingMode
{
    if (_map == nil) {
          return;
    }
    if (!_followUserLocation) {
        _map.userTrackingMode = MLNUserTrackingModeNone;
        return;
    }
    
    MLNMapCamera *camera = _map.camera;
    if (_followPitch != nil && [_followPitch floatValue] >= 0.0) {
        camera.pitch = [_followPitch floatValue];
    } else if (_stop != nil && _stop[@"pitch"] != nil) {
        camera.pitch = [_stop[@"pitch"] floatValue];
    }
    
    if ([self _userTrackingMode] != MLNUserTrackingModeFollowWithCourse && [self _userTrackingMode] != MLNUserTrackingModeFollowWithHeading) {
        if (_followHeading != nil && [_followHeading floatValue] >= 0.0) {
            camera.heading = [_followHeading floatValue];
        } else if (_stop != nil && _stop[@"heading"] != nil) {
            camera.heading = [_stop[@"heading"] floatValue];
        }
    }
    
    if (_followZoomLevel != nil && [_followZoomLevel doubleValue] >= 0.0) {
        camera.altitude = [_map altitudeFromZoom:[_followZoomLevel doubleValue]];
    }

    [_map setCamera:camera animated:NO];

    if (_map.userTrackingMode != [self _userTrackingMode]) {
      [_map setUserTrackingMode:[self _userTrackingMode] animated:NO completionHandler:nil];
    }
}

- (NSUInteger)_userTrackingMode
{
    if ([_followUserMode isEqualToString:@"compass"]) {
        return MLNUserTrackingModeFollowWithHeading;
    } else if ([_followUserMode isEqualToString:@"course"]) {
        return MLNUserTrackingModeFollowWithCourse;
    } else if (_followUserLocation) {
        return MLNUserTrackingModeFollow;
    } else {
        return MLNUserTrackingModeNone;
    }
}

- (id)_trackingModeToString:(MLNUserTrackingMode) mode {
    switch (mode) {
        case MLNUserTrackingModeFollowWithHeading:
            return @"compass";
        case MLNUserTrackingModeFollowWithCourse:
            return @"course";
        case MLNUserTrackingModeFollow:
            return @"normal";
        case MLNUserTrackingModeNone:
            return [NSNull null];
    }
}

- (void)initialLayout
{
    [self _setInitialCamera];
    [self _updateCamera];
}

- (void)didChangeUserTrackingMode:(MLNUserTrackingMode)mode animated:(BOOL)animated
{
    NSDictionary *payload = @{ @"followUserMode": [self _trackingModeToString: mode], @"followUserLocation": @((BOOL)(mode != MLNUserTrackingModeNone)) };
    MLRNEvent *event = [MLRNEvent makeEvent:RCT_MAPBOX_USER_TRACKING_MODE_CHANGE withPayload:payload];
    if (_onUserTrackingModeChange) {
        _onUserTrackingModeChange([event toJSON]);
    }
}

@end
