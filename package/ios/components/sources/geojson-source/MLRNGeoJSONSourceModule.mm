#import "MLRNGeoJSONSourceModule.h"

#import <React/RCTUIManager.h>
#import "FilterParser.h"
#import "MLRNGeoJSONSource.h"
#import "MLRNGeoJSONSourceComponentView.h"
#import "MLRNUtils.h"
#import "MLRNViewModuleUtils.h"

@implementation MLRNGeoJSONSourceModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (NSString *)moduleName {
  return @"MLRNGeoJSONSourceModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeGeoJSONSourceModuleSpecJSI>(params);
}

- (void)withShapeSource:(NSInteger)reactTag
                  block:(void (^)(MLRNGeoJSONSource *))block
                 reject:(RCTPromiseRejectBlock)reject
             methodName:(NSString *)methodName {
  [MLRNViewModuleUtils withView:self.viewRegistry_DEPRECATED
                       reactTag:reactTag
             componentViewClass:[MLRNGeoJSONSourceComponentView class]
               contentViewClass:[MLRNGeoJSONSource class]
                          block:^(UIView *view) {
                            block((MLRNGeoJSONSource *)view);
                          }
                         reject:reject
                     methodName:methodName];
}

- (MLNPointFeatureCluster *)clusterFromClusterId:(NSInteger)clusterId {
  NSString *featureJSON =
      [NSString stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%ld},"
                                 @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                 (long)clusterId];
  MLNPointFeature *feature = (MLNPointFeature *)[MLRNUtils shapeFromGeoJSON:featureJSON];
  return (MLNPointFeatureCluster *)feature;
}

- (void)getData:(NSInteger)reactTag
         filter:(NSArray *)filter
        resolve:(nonnull RCTPromiseResolveBlock)resolve
         reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withShapeSource:reactTag
                  block:^(MLRNGeoJSONSource *shapeSource) {
                    NSPredicate *predicate = [FilterParser parse:filter];
                    NSArray<id<MLNFeature>> *shapes =
                        [shapeSource featuresMatchingPredicate:predicate];

                    NSMutableArray<NSDictionary *> *features =
                        [[NSMutableArray alloc] initWithCapacity:shapes.count];
                    for (int i = 0; i < shapes.count; i++) {
                      [features addObject:shapes[i].geoJSONDictionary];
                    }

                    resolve(@{@"type" : @"FeatureCollection", @"features" : features});
                  }
                 reject:reject
             methodName:@"getData"];
}

- (void)getClusterExpansionZoom:(NSInteger)reactTag
                      clusterId:(NSInteger)clusterId
                        resolve:(nonnull RCTPromiseResolveBlock)resolve
                         reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withShapeSource:reactTag
                  block:^(MLRNGeoJSONSource *shapeSource) {
                    MLNPointFeatureCluster *cluster = [self clusterFromClusterId:clusterId];
                    double zoom = [shapeSource getClusterExpansionZoom:cluster];
                    if (zoom == -1) {
                      reject(@"zoom_error",
                             [NSString stringWithFormat:@"Could not get zoom for cluster %ld",
                                                        (long)clusterId],
                             nil);
                      return;
                    }
                    resolve(@(zoom));
                  }
                 reject:reject
             methodName:@"getClusterExpansionZoom"];
}

- (void)getClusterLeaves:(NSInteger)reactTag
               clusterId:(NSInteger)clusterId
                   limit:(NSInteger)limit
                  offset:(NSInteger)offset
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withShapeSource:reactTag
                  block:^(MLRNGeoJSONSource *shapeSource) {
                    MLNPointFeatureCluster *cluster = [self clusterFromClusterId:clusterId];
                    NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterLeaves:cluster
                                                                             number:limit
                                                                             offset:offset];

                    NSMutableArray<NSDictionary *> *features =
                        [[NSMutableArray alloc] initWithCapacity:shapes.count];
                    for (int i = 0; i < shapes.count; i++) {
                      [features addObject:shapes[i].geoJSONDictionary];
                    }

                    resolve(features);
                  }
                 reject:reject
             methodName:@"getClusterLeaves"];
}

- (void)getClusterChildren:(NSInteger)reactTag
                 clusterId:(NSInteger)clusterId
                   resolve:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withShapeSource:reactTag
                  block:^(MLRNGeoJSONSource *shapeSource) {
                    MLNPointFeatureCluster *cluster = [self clusterFromClusterId:clusterId];
                    NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterChildren:cluster];

                    NSMutableArray<NSDictionary *> *features =
                        [[NSMutableArray alloc] initWithCapacity:shapes.count];
                    for (int i = 0; i < shapes.count; i++) {
                      [features addObject:shapes[i].geoJSONDictionary];
                    }

                    resolve(features);
                  }
                 reject:reject
             methodName:@"getClusterChildren"];
}

@end
