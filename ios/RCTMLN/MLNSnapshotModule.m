//
//  MLNSnapshotModule.m
//  RCTMLN
//
//  Created by Nick Italiano on 12/1/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLNSnapshotModule.h"
#import "RCTMLNUtils.h"
#import "RNMBImageUtils.h"
@import MapLibre;

@implementation MLNSnapshotModule

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(takeSnap:(NSDictionary *)jsOptions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        MLNMapSnapshotOptions *options = [self _getOptions:jsOptions];
        __block MLNMapSnapshotter *snapshotter = [[MLNMapSnapshotter alloc] initWithOptions:options];

        [snapshotter startWithCompletionHandler:^(MLNMapSnapshot * _Nullable snapshot, NSError * _Nullable err) {         
            if (err != nil) {
                reject(@"takeSnap", @"Could not create snapshot", err);
                snapshotter = nil;
                return;
            }
            
            NSString *result = nil;
            if ([jsOptions[@"writeToDisk"] boolValue]) {
                result = [RNMBImageUtils createTempFile:snapshot.image];
            } else {
                result = [RNMBImageUtils createBase64:snapshot.image];
            }
            
            resolve(result);
            snapshotter = nil;
        }];
    });
}

- (MLNMapSnapshotOptions *)_getOptions:(NSDictionary *)jsOptions
{
    MLNMapCamera *camera = [[MLNMapCamera alloc] init];
    
    camera.pitch = [jsOptions[@"pitch"] doubleValue];
    camera.heading = [jsOptions[@"heading"] doubleValue];
    
    if (jsOptions[@"centerCoordinate"] != nil) {
        camera.centerCoordinate = [RCTMLNUtils fromFeature:jsOptions[@"centerCoordinate"]];
    }
    
    NSNumber *width = jsOptions[@"width"];
    NSNumber *height = jsOptions[@"height"];
    CGSize size = CGSizeMake([width doubleValue], [height doubleValue]);
    
    MLNMapSnapshotOptions *options = [[MLNMapSnapshotOptions alloc] initWithStyleURL:[NSURL URLWithString:jsOptions[@"styleURL"]]
                                                                   camera:camera
                                                                   size:size];
    if (jsOptions[@"zoomLevel"] != nil) {
        options.zoomLevel = [jsOptions[@"zoomLevel"] doubleValue];
    }
    
    if (jsOptions[@"bounds"] != nil) {
        options.coordinateBounds = [RCTMLNUtils fromFeatureCollection:jsOptions[@"bounds"]];
    }

    return options;
}

@end
