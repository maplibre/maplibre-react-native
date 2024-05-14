//
//  RCTMLNCalloutViewManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 10/13/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNCalloutManager.h"
#import "RCTMLNCallout.h"

@implementation RCTMLNCalloutManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[RCTMLNCallout alloc] init];
}

@end
