//
//  RCTMLNBackgroundLayer.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNBackgroundLayer.h"
#import "RCTMLNStyle.h"

@implementation RCTMLNBackgroundLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    return [[MLNBackgroundStyleLayer alloc] initWithIdentifier:self.id];
}

- (void)addStyles
{
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style backgroundLayer:(MLNBackgroundStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
