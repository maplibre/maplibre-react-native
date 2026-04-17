#import "MLRNLocation.h"

@implementation MLRNLocation

- (id)numberOrNull:(double)value {
  return value < 0 ? [NSNull null] : @(value);
}

- (NSDictionary<NSString *, id> *)toJSON {
  double altitudeAccuracy = _location.verticalAccuracy;

  return @{
    @"coords" : @{
      @"longitude" : @(_location.coordinate.longitude),
      @"latitude" : @(_location.coordinate.latitude),
      @"accuracy" : @(_location.horizontalAccuracy),
      @"altitude" : altitudeAccuracy < 0 ? [NSNull null] : @(_location.altitude),
      @"altitudeAccuracy" : [self numberOrNull:altitudeAccuracy],
      @"heading" : [self numberOrNull:_location.course],
      @"speed" : [self numberOrNull:_location.speed]
    },
    @"timestamp" : @([_location.timestamp timeIntervalSince1970])
  };
}

@end
