//
//  ViewManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 8/31/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "ViewManager.h"

@implementation ViewManager
{
    NSMutableDictionary<NSString*, NSNumber*> *eventTimestampCache;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

+ (NSString *)moduleName
{
    // Hack, to prevent JS from throwing a useless warning
    return @"RCTViewManager";
}

static NSTimeInterval EVENT_THROTTLE_S = 0.01;

- (instancetype)init
{
    if (self = [super init]) {
        eventTimestampCache = [[NSMutableDictionary alloc] init];
    }
    
    return self;
}

- (void)fireEvent:(RCTMLNEvent*)event withCallback:(RCTBubblingEventBlock)callback
{
    if (![self _shouldDropEvent:event]) {
        NSString *cacheKey = [self _getCacheKey:event];
        NSTimeInterval now = [[NSDate date] timeIntervalSince1970];
        [eventTimestampCache setObject:[NSNumber numberWithDouble:now] forKey:cacheKey];
        
        if (callback != nil) {
            callback([event toJSON]);
        }
    }
}

- (BOOL)_shouldDropEvent:(RCTMLNEvent *)event
{
    NSString *cacheKey = [self _getCacheKey:event];
    NSNumber *lastTimestamp = [eventTimestampCache objectForKey:cacheKey];
    return lastTimestamp != nil && (event.timestamp - [lastTimestamp doubleValue]) <= EVENT_THROTTLE_S;
}

- (NSString*)_getCacheKey:(RCTMLNEvent*)event
{
    return event.type;
}

@end
