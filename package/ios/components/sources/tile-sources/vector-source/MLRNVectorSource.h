#import "MLRNTileSource.h"

#import <MapLibre/MapLibre.h>

@interface MLRNVectorSource : MLRNTileSource

- (nonnull NSArray<id<MLNFeature>> *)
    featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers
                                predicate:(nullable NSPredicate *)predicate;

@end
