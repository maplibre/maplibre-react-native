#import "CameraStop.h"
#import "CameraEasing.h"
#import "MLRNCamera.h"
#import "MLRNUtils.h"

@implementation CameraStop

- (void)setEasing:(NSNumber *)easing {
  NSInteger value = easing ? easing.integerValue : (NSInteger)MLRNCameraEasingNone;
  switch (value) {
    case MLRNCameraEasingNone:
    case MLRNCameraEasingLinear:
    case MLRNCameraEasingEase:
    case MLRNCameraEasingFly:
      _easing = @(value);
      break;
    default:
      _easing = @(MLRNCameraEasingNone);
      break;
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
    stop.center = [MLRNUtils fromLongitude:args[@"center"][0] latitude:args[@"center"][1]];
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
    stop.bounds = [MLRNUtils fromReactBounds:args[@"bounds"]];
  }

  NSDictionary *padding = args[@"padding"];
  stop.padding =
      padding ? UIEdgeInsetsMake([padding[@"top"] floatValue], [padding[@"left"] floatValue],
                                 [padding[@"bottom"] floatValue], [padding[@"right"] floatValue])
              : UIEdgeInsetsZero;

  NSTimeInterval duration = 0;
  if (args[@"duration"]) {
    duration = [MLRNUtils fromMS:args[@"duration"]];
  }
  stop.duration = duration;

  if (args[@"easing"]) {
    stop.easing = @([args[@"easing"] integerValue]);
  }

  return stop;
}

@end
