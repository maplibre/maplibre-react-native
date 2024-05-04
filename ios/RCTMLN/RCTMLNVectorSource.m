//
//  RCTMGLVectorSource.m
//  RCTMGL
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMGLVectorSource.h"

@implementation RCTMGLVectorSource

- (nullable MLNSource*)makeSource
{
    if (self.url != nil) {
        return [[MLNVectorTileSource alloc] initWithIdentifier:self.id configurationURL:[NSURL URLWithString:self.url]];
    }
    return [[MLNVectorTileSource alloc] initWithIdentifier:self.id tileURLTemplates:self.tileUrlTemplates options:[self getOptions]];
}

- (nonnull NSArray<id <MLNFeature>> *)featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers predicate:(nullable NSPredicate *)predicate
{
    MLNVectorTileSource* vectorSource = (MLNVectorTileSource*)self.source;
    
    return [vectorSource featuresInSourceLayersWithIdentifiers:sourceLayerIdentifiers predicate: predicate];
}

@end
