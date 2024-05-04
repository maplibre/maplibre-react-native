//
//  RCTMLNFillLayerManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNFillLayerManager.h"
#import "RCTMLNFillLayer.h"

@implementation RCTMLNFillLayerManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(sourceLayerID, NSString);

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
    RCTMLNFillLayer *layer = [RCTMLNFillLayer new];
    layer.bridge = self.bridge;
    return layer;
}

@end
