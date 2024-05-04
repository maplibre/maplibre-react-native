//
//  RCTMLNFillExtrusionLayer.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/15/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNFillExtrusionLayer.h"
#import "RCTMLNStyle.h"
#import <React/RCTLog.h>

@implementation RCTMLNFillExtrusionLayer

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
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style fillExtrusionLayer:(MLNFillExtrusionStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
