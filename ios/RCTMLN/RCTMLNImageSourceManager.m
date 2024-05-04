//
//  RCTMLNImageSourceManager.m
//  RCTMLN
//
//  Created by Nick Italiano on 11/29/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNImageSourceManager.h"
#import "RCTMLNImageSource.h"

@implementation RCTMLNImageSourceManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(coordinates, NSArray)

- (UIView*)view
{
    return [RCTMLNImageSource new];
}

@end
