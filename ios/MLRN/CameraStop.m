#import "CameraStop.h"
#import "CameraMode.h"
#import "MLRNUtils.h"
#import "MLRNCamera.h"

@implementation CameraStop

- (void)setMode:(NSNumber *)mode
{
    int modeInt = [mode intValue];
    
    if (modeInt == RCT_MAPBOX_CAMERA_MODE_FLIGHT) {
        _mode = [NSNumber numberWithInt:modeInt];
    } else if (modeInt == RCT_MAPBOX_CAMERA_MODE_NONE) {
        _mode = [NSNumber numberWithInt:modeInt];
    } else if (modeInt == RCT_MAPBOX_CAMERA_MODE_LINEAR) {
        _mode = [NSNumber numberWithInt:modeInt];
    } else {
        _mode = [NSNumber numberWithInt:RCT_MAPBOX_CAMERA_MODE_EASE];
    }
}

-(id)init {
     if (self = [super init])  {
         self.coordinate = kCLLocationCoordinate2DInvalid;
         self.bounds = MLNCoordinateBoundsMake(kCLLocationCoordinate2DInvalid, kCLLocationCoordinate2DInvalid);
     }
     return self;
}


+ (CameraStop*)fromDictionary:(NSDictionary *)args
{
    CameraStop *stop = [[CameraStop alloc] init];
    
    if (args[@"pitch"]) {
        stop.pitch = args[@"pitch"];
    }
    
    if (args[@"heading"]) {
        stop.heading = args[@"heading"];
    }

    if (args[@"centerCoordinate"]) {
        stop.coordinate = [MLRNUtils fromFeature:args[@"centerCoordinate"]];
    }
    
    if (args[@"zoom"]) {
        stop.zoom = args[@"zoom"];
    }
    
    if (args[@"mode"]) {
        stop.mode = args[@"mode"];
    }
    
    if (args[@"bounds"]) {
        stop.bounds = [MLRNUtils fromFeatureCollection:args[@"bounds"]];
    }
    
    CGFloat paddingTop = args[@"paddingTop"] ? [args[@"paddingTop"] floatValue] : 0.0;
    CGFloat paddingRight = args[@"paddingRight"] ? [args[@"paddingRight"] floatValue] : 0.0;
    CGFloat paddingBottom = args[@"paddingBottom"] ? [args[@"paddingBottom"] floatValue] : 0.0;
    CGFloat paddingLeft = args[@"paddingLeft"] ? [args[@"paddingLeft"] floatValue] : 0.0;
    stop.padding = UIEdgeInsetsMake(paddingTop, paddingLeft, paddingBottom, paddingRight);
    
    NSTimeInterval duration = 2.0;
    if (args[@"duration"]) {
        duration = [MLRNUtils fromMS:args[@"duration"]];
    }
    stop.duration = duration;
    
    return stop;
}

@end
