#import <CoreLocation/CoreLocation.h>

#import "MLRNLocation.h"
#import "MLRNLocationModule.h"
#import "MLRNLocationManager.h"
#import "MLRNLocationManagerDelegate.h"
#import "MLRNEventTypes.h"

@interface MLRNLocationModule() <MLRNLocationManagerDelegate>
@end

@implementation MLRNLocationModule
{
    MLRNLocationManager *locationManager;
    BOOL hasListeners;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (instancetype)init
{
    if (self = [super init]) {
        locationManager = [[MLRNLocationManager alloc] init];
        locationManager.delegate = self;
    }
    return self;
}

- (void)startObserving
{
    [super startObserving];
    hasListeners = YES;
}

- (void)stopObserving
{
    [super stopObserving];
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[RCT_MAPBOX_USER_LOCATION_UPDATE];
}

RCT_EXPORT_METHOD(start:(CLLocationDistance)minDisplacement)
{
  [locationManager start:minDisplacement];
}

RCT_EXPORT_METHOD(pause)
{
    [locationManager stop];
}

RCT_EXPORT_METHOD(stop)
{
    [locationManager stop];
}

RCT_EXPORT_METHOD(setMinDisplacement:(CLLocationDistance)minDisplacement)
{
    [locationManager setMinDisplacement:minDisplacement];
}

RCT_EXPORT_METHOD(getLastKnownLocation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    MLRNLocation *lastKnownLocation = [locationManager getLastKnownLocation];
    resolve(lastKnownLocation);
}

- (void)locationManager:(MLRNLocationManager *)locationManager didUpdateLocation:(MLRNLocation *)location
{
    if (!hasListeners) {
        return;
    }

    if (self.bridge == nil) {
        return;
    }

    [self sendEventWithName:RCT_MAPBOX_USER_LOCATION_UPDATE body:[location toJSON]];
}

@end

