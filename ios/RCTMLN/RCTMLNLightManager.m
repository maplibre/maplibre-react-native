//
//  RCTMLNLightManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/26/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNLightManager.h"
#import "RCTMLNLight.h"

@implementation RCTMLNLightManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

- (UIView*)view
{
    return [RCTMLNLight new];
}

@end
