//
//  MLRNRasterLayer.m
//  MLRN
//
//  Created by Nick Italiano on 9/25/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNRasterLayer.h"
#import "MLRNStyle.h"

@implementation MLRNRasterLayer

- (MLNStyleLayer*)makeLayer:(MLNStyle*)style
{
    MLNSource *source =  [style sourceWithIdentifier:self.sourceID];
    if (source == nil) { return nil; }
    MLNRasterStyleLayer *layer = [[MLNRasterStyleLayer alloc] initWithIdentifier:self.id source:source];
    return layer;
}

- (void)addStyles
{
    MLRNStyle *style = [[MLRNStyle alloc] initWithMLNStyle:self.style];
    style.bridge = self.bridge;
    [style rasterLayer:(MLNRasterStyleLayer*)self.styleLayer withReactStyle:self.reactStyle isValid:^{ return [self isAddedToMap];
    }];
}

@end
