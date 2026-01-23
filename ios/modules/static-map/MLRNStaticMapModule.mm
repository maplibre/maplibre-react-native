#import "MLRNStaticMapModule.h"
#import <MapLibre/MapLibre.h>
#import <React/RCTConvert.h>
#import "MLRNImageUtils.h"
#import "MLRNUtils.h"

@implementation MLRNStaticMapModule

+ (NSString *)moduleName {
  return @"MLRNStaticMapModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeStaticMapModuleSpecJSI>(params);
}

- (void)createImage:(JS::NativeStaticMapModule::NativeStaticMapCreateOptions &)options
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject {
  MLNMapSnapshotOptions *mapSnapshotOptions = [self _getOptions:options];
  NSString *output = options.output();

  dispatch_async(dispatch_get_main_queue(), ^{
    MLNMapSnapshotter *snapshotter = [[MLNMapSnapshotter alloc] initWithOptions:mapSnapshotOptions];
    __block MLNMapSnapshotter *snapshotterRef = snapshotter;

    [snapshotter
        startWithCompletionHandler:^(MLNMapSnapshot *_Nullable snapshot, NSError *_Nullable error) {
          if (error) {
            snapshotterRef = nil;
            reject(@"createImage", @"Could not create static map image", error);
            return;
          }

          NSString *result = nil;
          if ([output isEqual:@"file"]) {
            result = [MLRNImageUtils createTempFile:snapshot.image];
          } else if ([output isEqual:@"base64"]) {
            result = [MLRNImageUtils createBase64:snapshot.image];
          }

          snapshotterRef = nil;
          resolve(result);
        }];
  });
}

- (MLNMapSnapshotOptions *)_getOptions:
    (JS::NativeStaticMapModule::NativeStaticMapCreateOptions &)options {
  MLNMapCamera *camera = [[MLNMapCamera alloc] init];

  camera.pitch = options.pitch().value_or(0.0);
  camera.heading = options.bearing().value_or(0.0);

  if (options.center().has_value() && options.center().value().size() == 2) {
    camera.centerCoordinate = [MLRNUtils fromLongitude:@(options.center().value()[0])
                                              latitude:@(options.center().value()[1])];
  }

  CGSize size = CGSizeMake(options.width(), options.height());

  MLNMapSnapshotOptions *mapSnapshotOptions = [[MLNMapSnapshotOptions alloc]
      initWithStyleURL:[MLRNUtils styleURLFromMapStyle:options.mapStyle()]
                camera:camera
                  size:size];

  if (options.bounds().has_value()) {
    auto boundsArray = options.bounds().value();
    mapSnapshotOptions.coordinateBounds = [MLRNUtils fromReactBounds:@[
      @(boundsArray[0]), @(boundsArray[1]), @(boundsArray[2]), @(boundsArray[3])
    ]];
  }

  if (options.zoom().has_value()) {
    mapSnapshotOptions.zoomLevel = options.zoom().value();
  }

  mapSnapshotOptions.showsLogo = options.logo().value_or(false);

  return mapSnapshotOptions;
}

@end
