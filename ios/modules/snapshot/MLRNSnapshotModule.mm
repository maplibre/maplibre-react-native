#import "MLRNSnapshotModule.h"
#import <MapLibre/MapLibre.h>
#import <React/RCTConvert.h>
#import "MLRNImageUtils.h"
#import "MLRNUtils.h"

@implementation MLRNSnapshotModule

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeSnapshotModuleSpecJSI>(params);
}

- (void)takeSnap:(JS::NativeSnapshotModule::SnapshotJsonOptions &)options
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    MLNMapSnapshotOptions *mapSnapshotOptions = [self _getOptions:options];
    MLNMapSnapshotter *snapshotter = [[MLNMapSnapshotter alloc] initWithOptions:mapSnapshotOptions];
    __block MLNMapSnapshotter *snapshotterRef = snapshotter;
    BOOL writeToDisk = options.writeToDisk();

    [snapshotter
        startWithCompletionHandler:^(MLNMapSnapshot *_Nullable snapshot, NSError *_Nullable error) {
          if (error) {
            snapshotterRef = nil;
            reject(@"takeSnap", @"Could not create snapshot", error);
            return;
          }

          NSString *result = nil;
          if (writeToDisk) {
            result = [MLRNImageUtils createTempFile:snapshot.image];
          } else {
            result = [MLRNImageUtils createBase64:snapshot.image];
          }

          snapshotterRef = nil;
          resolve(result);
        }];
  });
}

- (MLNMapSnapshotOptions *)_getOptions:(JS::NativeSnapshotModule::SnapshotJsonOptions &)options {
  MLNMapCamera *camera = [[MLNMapCamera alloc] init];

  camera.pitch = options.pitch();
  camera.heading = options.heading();

  if (options.centerCoordinate() != nil) {
    camera.centerCoordinate = [MLRNUtils fromFeature:options.centerCoordinate()];
  }

  CGSize size = CGSizeMake(options.width(), options.height());

  MLNMapSnapshotOptions *mapSnapshotOptions =
      [[MLNMapSnapshotOptions alloc] initWithStyleURL:[NSURL URLWithString:options.styleURL()]
                                               camera:camera
                                                 size:size];

  if (options.zoomLevel().has_value()) {
    mapSnapshotOptions.zoomLevel = options.zoomLevel().value();
  }

  if (options.bounds() != nil) {
    mapSnapshotOptions.coordinateBounds = [MLRNUtils fromFeatureCollection:options.bounds()];
  }

  return mapSnapshotOptions;
}

@end
