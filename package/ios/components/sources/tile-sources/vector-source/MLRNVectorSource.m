#import "MLRNVectorSource.h"

@implementation MLRNVectorSource

- (nullable MLNSource *)makeSource {
  if (self.url != nil) {
    return [[MLNVectorTileSource alloc] initWithIdentifier:self.id configurationURLString:self.url];
  }
  return [[MLNVectorTileSource alloc] initWithIdentifier:self.id
                                        tileURLTemplates:self.tileUrlTemplates
                                                 options:[self getOptions]];
}

- (nonnull NSArray<id<MLNFeature>> *)
    featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers
                                predicate:(nullable NSPredicate *)predicate {
  MLNVectorTileSource *vectorSource = (MLNVectorTileSource *)self.source;

  return [vectorSource featuresInSourceLayersWithIdentifiers:sourceLayerIdentifiers
                                                   predicate:predicate];
}

- (BOOL)setFeatureState:(nonnull NSString *)sourceLayerID
              featureID:(nonnull NSString *)featureID
                  state:(nonnull NSDictionary<NSString *, id> *)state {
  MLNVectorTileSource *vectorSource = (MLNVectorTileSource *)self.source;

  return [vectorSource setFeatureStateForSourceLayerID:sourceLayerID
                                             featureID:featureID
                                                 state:state];
}

- (nullable NSDictionary<NSString *, id> *)getFeatureState:(nonnull NSString *)sourceLayerID
                                                 featureID:(nonnull NSString *)featureID {
  MLNVectorTileSource *vectorSource = (MLNVectorTileSource *)self.source;

  return [vectorSource featureStateForSourceLayerID:sourceLayerID featureID:featureID];
}

- (BOOL)removeFeatureState:(nonnull NSString *)sourceLayerID
                 featureID:(nullable NSString *)featureID
                       key:(nullable NSString *)key {
  MLNVectorTileSource *vectorSource = (MLNVectorTileSource *)self.source;

  return [vectorSource removeFeatureStateForSourceLayerID:sourceLayerID
                                                featureID:featureID
                                                 stateKey:key];
}

@end
