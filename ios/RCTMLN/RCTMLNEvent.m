//
//  RCTMLNEvent.m
//  RCTMLN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNEvent.h"

@implementation RCTMLNEvent

- (instancetype)init
{
    if (self = [super init]) {
        _timestamp = [[NSDate date] timeIntervalSince1970];
    }
    return self;
}

- (NSDictionary*)payload
{
    if (_payload == nil) {
        return @{};
    }
    return _payload;
}

- (NSDictionary*)toJSON
{
    return @{ @"type": self.type, @"payload": self.payload };
}

+ (RCTMLNEvent*)makeEvent:(NSString*)type
{
    return [RCTMLNEvent makeEvent:type withPayload:@{}];
}

+ (RCTMLNEvent*)makeEvent:(NSString*)type withPayload:(NSDictionary*)payload
{
    RCTMLNEvent *event = [[RCTMLNEvent alloc] init];
    event.type = type;
    event.payload = payload;
    return event;
}

@end
