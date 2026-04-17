#import "MLRNLocation.h"
#import "MLRNLocationManagerDelegate.h"

typedef void (^MLRNLocationBlock)(MLRNLocation *location);
typedef void (^MLRNPermissionsBlock)(BOOL granted);

@interface MLRNLocationManager : NSObject

@property (nonatomic, strong) id<MLRNLocationManagerDelegate> delegate;

+ (id)sharedInstance;

- (void)start;
- (void)stop;
- (void)setMinDisplacement:(CLLocationDistance)minDisplacement;
- (BOOL)isEnabled;
- (MLRNLocation *)getLastKnownLocation;
- (void)requestPermissions:(MLRNPermissionsBlock)completion;

@end
