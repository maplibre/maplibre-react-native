//
//  MLRNCalloutViewManager.m
//  MLRN
//
//  Created by Nick Italiano on 10/13/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNCalloutManager.h"
#import "MLRNCallout.h"

@implementation MLRNCalloutManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[MLRNCallout alloc] init];
}

@end
