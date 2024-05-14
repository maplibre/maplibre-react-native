//
//  RCTMLNImageQueue.m
//  RCTMLN
//
//  Created by Nick Italiano on 10/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNImageQueue.h"
#import "RCTMLNImageQueueOperation.h"
#import "RCTMLNUtils.h"

@implementation RCTMLNImageQueue
{
    NSOperationQueue *imageQueue;
}

- (id)init
{
    if (self = [super init]) {
        imageQueue = [[NSOperationQueue alloc] init];
        imageQueue.name = @"com.maplibre.rctmln.DownloadImageQueue";
    }
    return self;
}

- (void)dealloc
{
    [self cancelAllOperations];
}

+ (instancetype)sharedInstance
{
    static RCTMLNImageQueue *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[RCTMLNImageQueue alloc] init];
    });
    return sharedInstance;
}

- (void)cancelAllOperations
{
    [imageQueue cancelAllOperations];
}

- (void)addImage:(NSString *)imageURL scale:(double)scale bridge:(RCTBridge *)bridge completionHandler:(RCTImageLoaderCompletionBlock)handler
{
    RCTMLNImageQueueOperation *operation = [[RCTMLNImageQueueOperation alloc] init];
    operation.bridge = bridge;
    operation.urlRequest = [RCTConvert NSURLRequest:imageURL];
    operation.completionHandler = handler;
    operation.scale = scale;
    [imageQueue addOperation:operation];
}

@end
