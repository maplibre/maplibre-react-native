#import "MLRNVectorSource.h"

@implementation MLRNVectorSource

- (nullable MLNSource*)makeSource
{
    if (self.url != nil) {
      if([self.url hasPrefix:@"pmtiles://"]) {
        return [[MLNVectorTileSource alloc] initWithIdentifier:self.id tileURLTemplates:@[self.url] options:[self getOptions]];
      } else {
        return [[MLNVectorTileSource alloc] initWithIdentifier:self.id configurationURL:[NSURL URLWithString:self.url]];
      }
    }
    
    return [[MLNVectorTileSource alloc] initWithIdentifier:self.id tileURLTemplates:self.tileUrlTemplates options:[self getOptions]];
}

- (nonnull NSArray<id <MLNFeature>> *)featuresInSourceLayersWithIdentifiers:(nonnull NSSet<NSString *> *)sourceLayerIdentifiers predicate:(nullable NSPredicate *)predicate
{
    MLNVectorTileSource* vectorSource = (MLNVectorTileSource*)self.source;
    
    return [vectorSource featuresInSourceLayersWithIdentifiers:sourceLayerIdentifiers predicate: predicate];
}

@end
