#import "MLRNLocation.h"

@class MLRNLocationManager;

@protocol MLRNLocationManagerDelegate <NSObject>

- (void)locationManager:(MLRNLocationManager *)locationManager
      didUpdateLocation:(MLRNLocation *)location;

@end
