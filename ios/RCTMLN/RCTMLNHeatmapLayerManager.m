//
//  RCTMLNHeatmapLayerManager.m
//  RCTMLN
//
//  Created by Dheeraj Yalamanchili on 6/8/19.
//

#import "RCTMLNHeatmapLayerManager.h"
#import "RCTMLNHeatmapLayer.h"

@implementation RCTMLNHeatmapLayerManager

RCT_EXPORT_MODULE()

// Heatmap layer props
RCT_EXPORT_VIEW_PROPERTY(sourceLayerID, NSString);

// standard layer props
RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_EXPORT_VIEW_PROPERTY(sourceID, NSString);
RCT_EXPORT_VIEW_PROPERTY(filter, NSArray);

RCT_EXPORT_VIEW_PROPERTY(aboveLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber);

- (UIView*)view
{
    RCTMLNHeatmapLayer *layer = [RCTMLNHeatmapLayer new];
    layer.bridge = self.bridge;
    return layer;
}

@end
