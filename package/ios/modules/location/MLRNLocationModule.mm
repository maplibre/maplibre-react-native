#import "MLRNLocationModule.h"
#import "MLRNEventTypes.h"
#import "MLRNLocation.h"
#import "MLRNLocationManager.h"
#import "MLRNLocationManagerDelegate.h"

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

- (void)start {
  [locationManager start];
}

- (void)pause {
  [locationManager stop];
}

- (void)stop {
  [locationManager stop];
}

- (void)setMinDisplacement:(CLLocationDistance)minDisplacement {
  [locationManager setMinDisplacement:minDisplacement];
}

- (void)getCurrentPosition:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNLocation *lastKnownLocation = [locationManager getLastKnownLocation];
  resolve(lastKnownLocation);
}

- (void)requestPermissions:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  [locationManager requestPermissions:^(BOOL granted) {
    if (granted) {
      resolve(nil);
    } else {
      reject(@"requestPermissions", @"Request denied", nil);
    }
  }];
}

- (void)locationManager:(MLRNLocationManager *)locationManager
      didUpdateLocation:(MLRNLocation *)location {
  [self emitOnUpdate:[location toJSON]];
}

@end
