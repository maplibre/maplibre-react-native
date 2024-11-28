//
//  MLRNBackgroundLayer.m
//  MLRN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNBackgroundLayer.h"
#import "MLRNStyle.h"

@implementation MLRNBackgroundLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    return [[MLNBackgroundStyleLayer alloc] initWithIdentifier:self.id];
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style backgroundLayer:(MLNBackgroundStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
