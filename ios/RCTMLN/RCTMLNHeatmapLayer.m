//
//  RCTMLNHeatmapLayer.m
//  RCTMLN
//
//  Created by Dheeraj Yalamanchili on 6/8/2019

#import "RCTMLNHeatmapLayer.h"
#import "RCTMLNStyle.h"

@implementation RCTMLNHeatmapLayer

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
    RCTMLNStyle *style = [[RCTMLNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style heatmapLayer:(MLNHeatmapStyleLayer *)self.styleLayer withReactStyle:self.reactStyle isValid:^{
        return [self isAddedToMap];
    }];
}

@end
