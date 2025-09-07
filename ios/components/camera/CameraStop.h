#import <MapLibre/MapLibre.h>

#import "MLRNCamera.h"

@interface CameraStop : NSObject

@property (nonatomic, assign) CLLocationCoordinate2D center;

@property (nonatomic, strong) NSNumber *zoom;
@property (nonatomic, strong) NSNumber *bearing;
@property (nonatomic, strong) NSNumber *pitch;

@property (nonatomic, assign) MLNCoordinateBounds bounds;
@property (nonatomic, assign) UIEdgeInsets padding;

@property (nonatomic, assign) NSTimeInterval duration;
@property (nonatomic, strong) NSNumber *mode;

+ (CameraStop *)fromDictionary:(NSDictionary *)args;

@end
