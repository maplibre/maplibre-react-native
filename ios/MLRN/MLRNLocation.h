#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface MLRNLocation : NSObject

@property (nonatomic, strong) CLLocation *location;
@property (nonatomic, strong) CLHeading *heading;

- (NSDictionary<NSString *, id> *)toJSON;

@end
