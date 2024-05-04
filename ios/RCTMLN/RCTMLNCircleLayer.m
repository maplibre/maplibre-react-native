//
//  RCTMLNCircleLayer.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/18/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNCircleLayer.h"
#import "RCTMLNStyle.h"

#import <React/RCTLog.h>

@implementation RCTMLNCircleLayer

- (MLNCircleStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNCircleStyleLayer *layer = [[MLNCircleStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style circleLayer:(MLNCircleStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
