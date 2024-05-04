//
//  RCTMLNLight.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/26/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNLight.h"
#import "RCTMLNStyle.h"

@implementation RCTMLNLight
{
    MLNLight *internalLight;
}

- (void)setReactStyle:(NSDictionary *)reactStyle
{
    _reactStyle = reactStyle;
    
    if (_map != nil) {
        [self addStyles];
    }
}

- (void)setMap:(MLNMapView *)map
{
    _map = map;
    [self addStyles];
}

- (BOOL)isAddedToMap {
    return _map != NULL;
}

- (void)addStyles
{
    MLNLight *light = [[MLNLight alloc] init];
    RCTMLNStyle *style = [[RCTMLNStyle alloc] init];
    [style lightLayer:light withReactStyle:_reactStyle isValid:^{
        return [self isAddedToMap];
    }];
    _map.style.light = light;
}

@end
