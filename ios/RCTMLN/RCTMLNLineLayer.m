//
//  RCTMGLLineLayer.m
//  RCTMGL
//
//  Created by Nick Italiano on 9/18/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMGLLineLayer.h"
#import "RCTMGLStyle.h"
#import <React/RCTLog.h>

@implementation RCTMGLLineLayer

- (MLNLineStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNLineStyleLayer *layer = [[MLNLineStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMGLStyle *style = [[RCTMGLStyle alloc] initWithMGLStyle:self.style];
    style.bridge = self.bridge;
    [style lineLayer:(MLNLineStyleLayer *)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
