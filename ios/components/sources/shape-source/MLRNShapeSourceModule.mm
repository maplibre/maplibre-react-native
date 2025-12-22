#import "MLRNShapeSourceModule.h"

#import <React/RCTUIManager.h>
#import "FilterParser.h"
#import "MLRNShapeSource.h"
#import "MLRNShapeSourceComponentView.h"

@implementation MLRNShapeSourceModule

+ (NSString *)moduleName {
  return @"MLRNShapeSourceModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeShapeSourceModuleSpecJSI>(params);
}

- (MLRNShapeSource *)getShapeSourceByReactTag:(NSInteger)reactTag {
  UIView<RCTComponentViewProtocol> *view = [self.bridge.uiManager viewForReactTag:@(reactTag)];

  if ([view isKindOfClass:[MLRNShapeSourceComponentView class]]) {
    MLRNShapeSourceComponentView *componentView = (MLRNShapeSourceComponentView *)view;
    return componentView.shapeSource;
  }

  RCTLogError(@"Invalid react tag, could not find MLRNShapeSource");
  return nil;
}

- (void)getData:(NSInteger)reactTag
         filter:(NSArray *)filter
        resolve:(nonnull RCTPromiseResolveBlock)resolve
         reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNShapeSource *shapeSource = [self getShapeSourceByReactTag:reactTag];
  if (shapeSource == nil) {
    reject(@"invalid_tag", @"Could not find MLRNShapeSource", nil);
    return;
  }

  NSPredicate *predicate = [FilterParser parse:filter];
  NSArray<id<MLNFeature>> *shapes = [shapeSource featuresMatchingPredicate:predicate];

  NSMutableArray<NSDictionary *> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
  for (int i = 0; i < shapes.count; i++) {
    [features addObject:shapes[i].geoJSONDictionary];
  }

  resolve(@{@"type" : @"FeatureCollection", @"features" : features});
}

- (void)getClusterExpansionZoom:(NSInteger)reactTag
                      clusterId:(NSInteger)clusterId
                        resolve:(nonnull RCTPromiseResolveBlock)resolve
                         reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNShapeSource *shapeSource = [self getShapeSourceByReactTag:reactTag];
  if (shapeSource == nil) {
    reject(@"invalid_tag", @"Could not find MLRNShapeSource", nil);
    return;
  }

  // Convert clusterId to a GeoJSON feature
  NSString *featureJSON =
      [NSString stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%ld},"
                                 @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                 (long)clusterId];

  double zoom = [shapeSource getClusterExpansionZoom:featureJSON];
  if (zoom == -1) {
    reject(@"zoom_error",
           [NSString stringWithFormat:@"Could not get zoom for cluster %ld", (long)clusterId], nil);
    return;
  }
  resolve(@(zoom));
}

- (void)getClusterLeaves:(NSInteger)reactTag
               clusterId:(NSInteger)clusterId
                   limit:(NSInteger)limit
                  offset:(NSInteger)offset
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNShapeSource *shapeSource = [self getShapeSourceByReactTag:reactTag];
  if (shapeSource == nil) {
    reject(@"invalid_tag", @"Could not find MLRNShapeSource", nil);
    return;
  }

  // Convert clusterId to a GeoJSON feature
  NSString *featureJSON =
      [NSString stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%ld},"
                                 @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                 (long)clusterId];

  NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterLeaves:featureJSON
                                                           number:limit
                                                           offset:offset];

  NSMutableArray<NSDictionary *> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
  for (int i = 0; i < shapes.count; i++) {
    [features addObject:shapes[i].geoJSONDictionary];
  }

  resolve(features);
}

- (void)getClusterChildren:(NSInteger)reactTag
                 clusterId:(NSInteger)clusterId
                   resolve:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  MLRNShapeSource *shapeSource = [self getShapeSourceByReactTag:reactTag];
  if (shapeSource == nil) {
    reject(@"invalid_tag", @"Could not find MLRNShapeSource", nil);
    return;
  }

  // Convert clusterId to a GeoJSON feature
  NSString *featureJSON =
      [NSString stringWithFormat:@"{\"type\":\"Feature\",\"properties\":{\"cluster_id\":%ld},"
                                 @"\"geometry\":{\"type\":\"Point\",\"coordinates\":[0,0]}}",
                                 (long)clusterId];

  NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterChildren:featureJSON];

  NSMutableArray<NSDictionary *> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
  for (int i = 0; i < shapes.count; i++) {
    [features addObject:shapes[i].geoJSONDictionary];
  }

  resolve(features);
}

@end
