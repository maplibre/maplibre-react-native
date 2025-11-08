#import "MLRNEventTypes.h"
#import "MLRNLocation.h"
#import "MLRNLocationManager.h"
#import "MLRNLocationManagerDelegate.h"
#import "MLRNLocationModule.h"

@implementation MLRNLocationModule {
  MLRNLocationManager *locationManager;
}

+ (NSString *)moduleName {
  return @"MLRNLocationModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLocationModuleSpecJSI>(params);
}

- (instancetype)init {
  if (self = [super init]) {
    locationManager = [[MLRNLocationManager alloc] init];
    locationManager.delegate = self;
  }

  return self;
}

- (void)start:(NSNumber *)minDisplacement {
  [locationManager start:[minDisplacement doubleValue]];
}

RCT_EXPORT_METHOD(pause) { [locationManager stop]; }

RCT_EXPORT_METHOD(stop) { [locationManager stop]; }

RCT_EXPORT_METHOD(setMinDisplacement : (CLLocationDistance)minDisplacement) {
  [locationManager setMinDisplacement:minDisplacement];
}

- (void)getCurrentPosition:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNLocation *lastKnownLocation = [locationManager getLastKnownLocation];
  resolve(lastKnownLocation);
}

- (void)locationManager:(MLRNLocationManager *)locationManager
      didUpdateLocation:(MLRNLocation *)location {
  [self emitOnUpdate:[location toJSON]];
}

@end
