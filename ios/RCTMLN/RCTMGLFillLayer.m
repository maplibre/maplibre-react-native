//
//  RCTMGLFillLayer.m
//  RCTMGL
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMGLFillLayer.h"
#import "RCTMGLStyle.h"
#import <React/RCTLog.h>

@implementation RCTMGLFillLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNFillStyleLayer *layer = [[MLNFillStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMGLStyle *style = [[RCTMGLStyle alloc] initWithMGLStyle:self.style];
    style.bridge = self.bridge;
    [style fillLayer:(MLNFillStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
