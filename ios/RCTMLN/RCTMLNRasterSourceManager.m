//
//  RCTMLNRasterSourceManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNRasterSourceManager.h"
#import "RCTMLNRasterSource.h"

@implementation RCTMLNRasterSourceManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileUrlTemplates, NSArray)
RCT_EXPORT_VIEW_PROPERTY(attribution, NSString)

RCT_EXPORT_VIEW_PROPERTY(tileSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(tms, BOOL)

- (UIView*)view
{
    return [RCTMLNRasterSource new];
}

@end
