//
//  RCTMGLRasterLayer.m
//  RCTMGL
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMGLRasterLayer.h"
#import "RCTMGLStyle.h"

@implementation RCTMGLRasterLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source =  [style sourceWithIdentifier:self.sourceID];
    if (source == nil) { return nil; }
    MLNRasterStyleLayer *layer = [[MLNRasterStyleLayer alloc] initWithIdentifier:self.id source:source];
    return layer;
}

- (void)addStyles
{
    RCTMGLStyle *style = [[RCTMGLStyle alloc] initWithMGLStyle:self.style];
    style.bridge = self.bridge;
    [style rasterLayer:(MLNRasterStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
