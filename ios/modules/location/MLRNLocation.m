#import "MLRNLocation.h"

@implementation MLRNLocation

- (NSDictionary<NSString *, id> *)toJSON {
  NSMutableDictionary<NSString *, id> *json = [[NSMutableDictionary alloc] init];

  NSMutableDictionary<NSString *, NSNumber *> *coords = [[NSMutableDictionary alloc] init];
  coords[@"longitude"] = @(_location.coordinate.longitude);
  coords[@"latitude"] = @(_location.coordinate.latitude);
  coords[@"accuracy"] = @(_location.horizontalAccuracy);
  coords[@"altitude"] = @(_location.altitude);
  coords[@"altitudeAccuracy"] = @(_location.verticalAccuracy);
  coords[@"heading"] = @(_location.course);
  coords[@"speed"] = @(_location.speed);

  json[@"coords"] = coords;
  json[@"timestamp"] = @([_location.timestamp timeIntervalSince1970]);

  return json;
}

@end
