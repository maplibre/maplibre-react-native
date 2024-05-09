//
//  RCTMLNVectorSource.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNTileSource.h"
@import MapLibre;

@interface RCTMLNVectorSource : RCTMLNTileSource

- (nonnull NSArray<id <MLNFeature>> *)featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers predicate:(nullable NSPredicate *)predicate;

@end
