//
//  RCTMLNLineLayerManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/18/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNLineLayerManager.h"
#import "RCTMLNLineLayer.h"

@implementation RCTMLNLineLayerManager

RCT_EXPORT_MODULE()

// line layer props
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
    RCTMLNLineLayer *layer = [RCTMLNLineLayer new];
    layer.bridge = self.bridge;
    return layer;
}


@end
