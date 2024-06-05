//
//  RCTMLNEvent.h
//  RCTMLN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTMLNEventProtocol.h"

@interface RCTMLNEvent : NSObject<RCTMLNEventProtocol>

@property (nonatomic, copy) NSString *type;
@property (nonatomic, strong) NSDictionary *payload;
@property (nonatomic, readonly) NSTimeInterval timestamp;

+ (RCTMLNEvent*)makeEvent:(NSString*)eventType;
+ (RCTMLNEvent*)makeEvent:(NSString*)eventType withPayload:(NSDictionary*)payload;

@end
