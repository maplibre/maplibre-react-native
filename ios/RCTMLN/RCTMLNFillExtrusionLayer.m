//
//  RCTMGLFillExtrusionLayer.m
//  RCTMGL
//
//  Created by Nick Italiano on 9/15/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMGLFillExtrusionLayer.h"
#import "RCTMGLStyle.h"
#import <React/RCTLog.h>

@implementation RCTMGLFillExtrusionLayer

- (MLNFillExtrusionStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNFillExtrusionStyleLayer *layer = [[MLNFillExtrusionStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMGLStyle *style = [[RCTMGLStyle alloc] initWithMGLStyle:self.style];
    style.bridge = self.bridge;
    [style fillExtrusionLayer:(MLNFillExtrusionStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
