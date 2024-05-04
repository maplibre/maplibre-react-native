//
//  RCTMGLHeatmapLayer.m
//  RCTMGL
//
//  Created by Dheeraj Yalamanchili on 6/8/2019

#import "RCTMGLHeatmapLayer.h"
#import "RCTMGLStyle.h"

@implementation RCTMGLHeatmapLayer

- (MLNHeatmapStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source = [self layerWithSourceIDInStyle:style];
    if (source == nil) { return nil; }
    MLNHeatmapStyleLayer *layer = [[MLNHeatmapStyleLayer alloc] initWithIdentifier:self.id source:source];
    layer.sourceLayerIdentifier = self.sourceLayerID;
    return layer;
}

- (void)addStyles
{
    RCTMGLStyle *style = [[RCTMGLStyle alloc] initWithMGLStyle:self.style];
    style.bridge = self.bridge;
    [style heatmapLayer:(MLNHeatmapStyleLayer *)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end