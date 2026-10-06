#import "MLRNTileSource.h"

#import <MapLibre/MapLibre.h>

@interface MLRNVectorSource : MLRNTileSource

- (nonnull NSArray<id<MLNFeature>> *)
    featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers
                                predicate:(nullable NSPredicate *)predicate;

- (BOOL)setFeatureState:(nonnull NSString *)sourceLayerID
              featureID:(nonnull NSString *)featureID
                  state:(nonnull NSDictionary<NSString *, id> *)state;
- (nullable NSDictionary<NSString *, id> *)getFeatureState:(nonnull NSString *)sourceLayerID
                                                 featureID:(nonnull NSString *)featureID;
- (BOOL)removeFeatureState:(nonnull NSString *)sourceLayerID
                 featureID:(nullable NSString *)featureID
                       key:(nullable NSString *)key;

@end
