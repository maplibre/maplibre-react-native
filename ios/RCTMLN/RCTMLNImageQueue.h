//
//  RCTMLNImageQueue.h
//  RCTMLN
//
//  Created by Nick Italiano on 10/23/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTImageLoader.h>

@interface RCTMLNImageQueue : NSObject

+ (instancetype)sharedInstance;

- (void)cancelAllOperations;
- (void)addImage:(NSString *)imageURL scale:(double)scale bridge:(RCTBridge *)bridge completionHandler:(RCTImageLoaderCompletionBlock)handler;

@end
