#import "MLRNCameraModule.h"

#import "CameraEasing.h"
#import "MLRNCamera.h"
#import "MLRNCameraComponentView.h"
#import "MLRNCameraManager.h"
#import "MLRNViewModuleUtils.h"

@implementation MLRNCameraModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (NSString *)moduleName {
  return @"MLRNCameraModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeCameraModuleSpecJSI>(params);
}

- (void)withCamera:(NSInteger)reactTag
             block:(void (^)(MLRNCamera *))block
            reject:(RCTPromiseRejectBlock)reject
        methodName:(NSString *)methodName {
  [MLRNViewModuleUtils withView:self.viewRegistry_DEPRECATED
                       reactTag:reactTag
             componentViewClass:[MLRNCameraComponentView class]
               contentViewClass:[MLRNCamera class]
                          block:^(UIView *view) {
                            block((MLRNCamera *)view);
                          }
                         reject:reject
                     methodName:methodName];
}

- (void)setStop:(NSInteger)reactTag
           stop:(JS::NativeCameraModule::NativeCameraStop &)stop
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
  NSMutableDictionary<NSString *, id> *stopDict = [NSMutableDictionary dictionary];

  if (stop.center().has_value() && stop.center().value().size() == 2) {
    NSArray<NSNumber *> *center = @[ @(stop.center().value()[0]), @(stop.center().value()[1]) ];
    stopDict[@"center"] = center;
  } else if (stop.bounds().has_value() && stop.bounds().value().size() == 4) {
    NSArray<NSNumber *> *bounds = @[
      @(stop.bounds().value()[0]), @(stop.bounds().value()[1]), @(stop.bounds().value()[2]),
      @(stop.bounds().value()[3])
    ];
    stopDict[@"bounds"] = bounds;
  }

  if (stop.padding().has_value()) {
    auto padding = stop.padding().value();
    stopDict[@"padding"] = @{
      @"top" : padding.top().has_value() ? @(padding.top().value()) : @0,
      @"right" : padding.right().has_value() ? @(padding.right().value()) : @0,
      @"bottom" : padding.bottom().has_value() ? @(padding.bottom().value()) : @0,
      @"left" : padding.left().has_value() ? @(padding.left().value()) : @0
    };
  }
  if (stop.zoom().has_value()) {
    stopDict[@"zoom"] = @(stop.zoom().value());
  }
  if (stop.bearing().has_value()) {
    stopDict[@"bearing"] = @(stop.bearing().value());
  }
  if (stop.pitch().has_value()) {
    stopDict[@"pitch"] = @(stop.pitch().value());
  }

  if (stop.duration().has_value()) {
    stopDict[@"duration"] = @(stop.duration().value());
  }
  if (stop.easing()) {
    NSString *easing = stop.easing();

    if ([easing isEqualToString:@"none"]) {
      stopDict[@"easing"] = @(MLRNCameraEasingLinear);
    } else if ([easing isEqualToString:@"linear"]) {
      stopDict[@"easing"] = @(MLRNCameraEasingLinear);
    } else if ([easing isEqualToString:@"ease"]) {
      stopDict[@"easing"] = @(MLRNCameraEasingEase);
    } else if ([easing isEqualToString:@"fly"]) {
      stopDict[@"easing"] = @(MLRNCameraEasingFly);
    }
  }

  [self withCamera:reactTag
             block:^(MLRNCamera *view) {
               [MLRNCameraManager handleImperativeStop:view
                                                  stop:[stopDict copy]
                                               resolve:resolve
                                                reject:reject];
             }
            reject:reject
        methodName:@"setStop"];
}

@end
