//
//  MLRNEvent.h
//  MLRN
//
//  Created by Nick Italiano on 8/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MLRNEventProtocol.h"

@interface MLRNEvent : NSObject<MLRNEventProtocol>

@property (nonatomic, copy) NSString *type;
@property (nonatomic, strong) NSDictionary *payload;
@property (nonatomic, readonly) NSTimeInterval timestamp;

+ (MLRNEvent*)makeEvent:(NSString*)eventType;
+ (MLRNEvent*)makeEvent:(NSString*)eventType withPayload:(NSDictionary*)payload;

@end
