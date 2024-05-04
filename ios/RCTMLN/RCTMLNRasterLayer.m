//
//  RCTMLNRasterLayer.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNRasterLayer.h"
#import "RCTMLNStyle.h"

@implementation RCTMLNRasterLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source =  [style sourceWithIdentifier:self.sourceID];
    if (source == nil) { return nil; }
    MLNRasterStyleLayer *layer = [[MLNRasterStyleLayer alloc] initWithIdentifier:self.id source:source];
    return layer;
}

- (void)addStyles
{
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style rasterLayer:(MLNRasterStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
