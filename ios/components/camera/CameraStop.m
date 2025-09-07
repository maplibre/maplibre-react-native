#import "CameraStop.h"
#import "CameraMode.h"
#import "MLRNCamera.h"
#import "MLRNUtils.h"

@implementation CameraStop

- (void)setMode:(NSNumber *)mode {
  int modeInt = [mode intValue];

  if (modeInt == RCT_MLRN_CAMERA_MODE_FLIGHT) {
    _mode = [NSNumber numberWithInt:modeInt];
  } else if (modeInt == RCT_MLRN_CAMERA_MODE_NONE) {
    _mode = [NSNumber numberWithInt:modeInt];
  } else if (modeInt == RCT_MLRN_CAMERA_MODE_LINEAR) {
    _mode = [NSNumber numberWithInt:modeInt];
  } else {
    _mode = [NSNumber numberWithInt:RCT_MLRN_CAMERA_MODE_EASE];
  }
}

- (id)init {
  if (self = [super init]) {
    self.center = kCLLocationCoordinate2DInvalid;
    self.bounds =
        MLNCoordinateBoundsMake(kCLLocationCoordinate2DInvalid, kCLLocationCoordinate2DInvalid);
  }

  return self;
}

+ (CameraStop *)fromDictionary:(NSDictionary *)args {
  CameraStop *stop = [[CameraStop alloc] init];

  if (args[@"center"]) {
    stop.center = [MLRNUtils fromFeature:args[@"center"]];
  }

  if (args[@"zoom"]) {
    stop.zoom = args[@"zoom"];
  }

  if (args[@"bearing"]) {
    stop.bearing = args[@"bearing"];
  }

  if (args[@"pitch"]) {
    stop.pitch = args[@"pitch"];
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

  if (args[@"mode"]) {
    stop.mode = args[@"mode"];
  }

  return stop;
}

@end
