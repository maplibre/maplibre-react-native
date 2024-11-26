//
//  MLRNVectorSource.h
//  MLRN
//
//  Created by Nick Italiano on 9/8/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "MLRNTileSource.h"
@import MapLibre;

@interface MLRNVectorSource : MLRNTileSource

- (nonnull NSArray<id <MLNFeature>> *)featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers predicate:(nullable NSPredicate *)predicate;

@end
