//
//  RCTMLNImageQueueOperation.h
//  RCTMLN
//
//  Created by Nick Italiano on 2/28/18.
//  Copyright © 2018 Mapbox Inc. All rights reserved.
//
#import <React/RCTImageLoader.h>

@interface RCTMLNImageQueueOperation : NSBlockOperation

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, copy) RCTImageLoaderCompletionBlock completionHandler;
@property (nonatomic, copy) NSURLRequest *urlRequest;
@property (nonatomic)       double scale;

@end
