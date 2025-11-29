#import "MLRNLocation.h"
#import "MLRNLocationManagerDelegate.h"

typedef void (^MLRNLocationBlock)(MLRNLocation *location);

@interface MLRNLocationManager : NSObject

@property (nonatomic, strong) id<MLRNLocationManagerDelegate> delegate;

+ (id)sharedInstance;

- (void)start;
- (void)stop;
- (void)setMinDisplacement:(CLLocationDistance)minDisplacement;
- (BOOL)isEnabled;
- (MLRNLocation *)getLastKnownLocation;

@end
