#import "MLRNShapeSourceModule.h"

#import <React/RCTUIManager.h>
#import "FilterParser.h"
#import "MLRNShapeSource.h"
#import "MLRNShapeSourceComponentView.h"
#import "MLRNViewModuleUtils.h"

@implementation MLRNShapeSourceModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (NSString *)moduleName {
  return @"MLRNShapeSourceModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeShapeSourceModuleSpecJSI>(params);
}

- (void)withShapeSource:(NSInteger)reactTag
                  block:(void (^)(MLRNShapeSource *))block
                 reject:(RCTPromiseRejectBlock)reject
             methodName:(NSString *)methodName {
  [MLRNViewModuleUtils withView:self.viewRegistry_DEPRECATED
                       reactTag:reactTag
             componentViewClass:[MLRNShapeSourceComponentView class]
               contentViewClass:[MLRNShapeSource class]
                          block:^(UIView *view) {
                            block((MLRNShapeSource *)view);
                          }
                         reject:reject
                     methodName:methodName];
}

- (void)getData:(NSInteger)reactTag
         filter:(NSArray *)filter
        resolve:(nonnull RCTPromiseResolveBlock)resolve
         reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withShapeSource:reactTag
                  block:^(MLRNShapeSource *shapeSource) {
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
  [self
      withShapeSource:reactTag
                block:^(MLRNShapeSource *shapeSource) {
                  // Convert clusterId to a GeoJSON feature
                  NSString *featureJSON = [NSString
                      stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%"
                                       @"ld},"
                                       @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                       (long)clusterId];

                  double zoom = [shapeSource getClusterExpansionZoom:featureJSON];
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
  [self
      withShapeSource:reactTag
                block:^(MLRNShapeSource *shapeSource) {
                  // Convert clusterId to a GeoJSON feature
                  NSString *featureJSON = [NSString
                      stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%"
                                       @"ld},"
                                       @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                       (long)clusterId];

                  NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterLeaves:featureJSON
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
  [self
      withShapeSource:reactTag
                block:^(MLRNShapeSource *shapeSource) {
                  // Convert clusterId to a GeoJSON feature
                  NSString *featureJSON = [NSString
                      stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%"
                                       @"ld},"
                                       @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                       (long)clusterId];

                  NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterChildren:featureJSON];

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
