//
//  MLRNLightManager.m
//  MLRN
//
//  Created by Nick Italiano on 9/26/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNLightManager.h"
#import "MLRNLight.h"

@implementation MLRNLightManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

- (UIView*)view
{
    return [MLRNLight new];
}

@end
