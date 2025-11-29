#import "MLRNLocationManager.h"
#import <CoreLocation/CoreLocation.h>

@interface MLRNLocationManager () <CLLocationManagerDelegate>
@end

@implementation MLRNLocationManager {
  CLLocationManager *locationManager;
  CLLocation *lastKnownLocation;
  CLHeading *lastKnownHeading;
  CLLocationDistance displacement;
  BOOL isListening;
}

+ (id)sharedInstance {
  static MLRNLocationManager *manager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    manager = [[self alloc] init];
  });
  return manager;
}

- (instancetype)init {
  if (self = [super init]) {
    [self _setupLocationManager];
    displacement = 0.0;
  }
  return self;
}

- (void)dealloc {
  locationManager.delegate = nil;
  [self stop];
}

- (void)start {
  if ([self isEnabled]) {
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [self->locationManager requestWhenInUseAuthorization];
    [self->locationManager startUpdatingLocation];
    [self->locationManager startUpdatingHeading];
    self->isListening = YES;
  });
}

- (void)setMinDisplacement:(CLLocationDistance)minDisplacement {
  displacement = minDisplacement;

  dispatch_async(dispatch_get_main_queue(), ^{
    [self->locationManager setDistanceFilter:(minDisplacement)];
  });
}

- (void)stop {
  if (![self isEnabled]) {
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [self->locationManager stopUpdatingLocation];
    [self->locationManager stopUpdatingHeading];
    self->isListening = NO;
  });
}

- (BOOL)isEnabled {
  return isListening;
}

- (MLRNLocation *)getLastKnownLocation {
  CLLocation *newLastLocation = locationManager.location;
  if (newLastLocation) {
    lastKnownLocation = newLastLocation;
  }
  MLRNLocation *location = [self _convertToMLRNLocation:lastKnownLocation];
  return location;
}

- (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)heading {
  lastKnownHeading = heading;

  if (displacement > 0) {
    return;
  }

  [self _updateDelegate];
}

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
  lastKnownLocation = [locations lastObject];
  [self _updateDelegate];
}

- (void)_setupLocationManager {
  __weak MLRNLocationManager *weakSelf = self;

  dispatch_async(dispatch_get_main_queue(), ^{
    self->locationManager = [[CLLocationManager alloc] init];
    self->locationManager.delegate = weakSelf;
  });
}

- (void)_updateDelegate {
  if (_delegate == nil) {
    return;
  }

  MLRNLocation *userLocation = [self _convertToMLRNLocation:lastKnownLocation];

  [_delegate locationManager:self didUpdateLocation:userLocation];
}

- (MLRNLocation *)_convertToMLRNLocation:(CLLocation *)location {
  if (location == nil) {
    return nil;
  }

  MLRNLocation *userLocation = [[MLRNLocation alloc] init];
  userLocation.location = location;
  userLocation.heading = lastKnownHeading;
  return userLocation;
}

@end
