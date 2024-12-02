@import MapLibre;
#import "MLRNCamera.h"

@interface CameraStop : NSObject

@property (nonatomic, strong) NSNumber *pitch;
@property (nonatomic, strong) NSNumber *heading;
@property (nonatomic, strong) NSNumber *zoom;
@property (nonatomic, strong) NSNumber *mode;
@property (nonatomic, assign) NSTimeInterval duration;

@property (nonatomic, assign) CLLocationCoordinate2D coordinate;
@property (nonatomic, assign) MLNCoordinateBounds bounds;
@property (nonatomic, assign) UIEdgeInsets padding;

+ (CameraStop*)fromDictionary:(NSDictionary*)args;

@end
