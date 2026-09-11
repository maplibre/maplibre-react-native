#import "MLRNVectorSourceModule.h"

#import <React/RCTUIManager.h>
#import "FilterParser.h"
#import "MLRNVectorSource.h"
#import "MLRNVectorSourceComponentView.h"
#import "MLRNViewModuleUtils.h"

@implementation MLRNVectorSourceModule

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (NSString *)moduleName {
  return @"MLRNVectorSourceModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeVectorSourceModuleSpecJSI>(params);
}

- (void)withVectorSource:(NSInteger)reactTag
                   block:(void (^)(MLRNVectorSource *))block
                  reject:(RCTPromiseRejectBlock)reject
              methodName:(NSString *)methodName {
  [MLRNViewModuleUtils withView:self.viewRegistry_DEPRECATED
                       reactTag:reactTag
             componentViewClass:[MLRNVectorSourceComponentView class]
               contentViewClass:[MLRNVectorSource class]
                          block:^(UIView *view) {
                            block((MLRNVectorSource *)view);
                          }
                         reject:reject
                     methodName:methodName];
}

- (void)querySourceFeatures:(NSInteger)reactTag
                sourceLayer:(NSString *)sourceLayer
                     filter:(NSArray *)filter
                    resolve:(nonnull RCTPromiseResolveBlock)resolve
                     reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withVectorSource:reactTag
                   block:^(MLRNVectorSource *vectorSource) {
                     NSSet *layerIDSet = nil;
                     if (sourceLayer != nil && sourceLayer.length > 0) {
                       layerIDSet = [NSSet setWithObject:sourceLayer];
                     }
                     NSPredicate *predicate = [FilterParser parse:filter];
                     NSArray<id<MLNFeature>> *shapes =
                         [vectorSource featuresInSourceLayersWithIdentifiers:layerIDSet
                                                                   predicate:predicate];

                     NSMutableArray<NSDictionary *> *features =
                         [[NSMutableArray alloc] initWithCapacity:shapes.count];
                     for (int i = 0; i < shapes.count; i++) {
                       [features addObject:shapes[i].geoJSONDictionary];
                     }

                     resolve(features);
                   }
                  reject:reject
              methodName:@"querySourceFeatures"];
}

- (void)setFeatureState:(NSInteger)reactTag
            sourceLayer:(nonnull NSString *)sourceLayer
              featureId:(nonnull NSString *)featureId
                  state:(nonnull NSDictionary *)state
                resolve:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withVectorSource:reactTag
                   block:^(MLRNVectorSource *vectorSource) {
                     if (![vectorSource setFeatureState:sourceLayer
                                              featureID:featureId
                                                  state:state]) {
                       reject(@"source_not_attached",
                              @"Source is not attached to a map, feature state was not set", nil);
                       return;
                     }
                     resolve(nil);
                   }
                  reject:reject
              methodName:@"setFeatureState"];
}

- (void)getFeatureState:(NSInteger)reactTag
            sourceLayer:(nonnull NSString *)sourceLayer
              featureId:(nonnull NSString *)featureId
                resolve:(nonnull RCTPromiseResolveBlock)resolve
                 reject:(nonnull RCTPromiseRejectBlock)reject {
  [self withVectorSource:reactTag
                   block:^(MLRNVectorSource *vectorSource) {
                     resolve([vectorSource getFeatureState:sourceLayer featureID:featureId]);
                   }
                  reject:reject
              methodName:@"getFeatureState"];
}

- (void)removeFeatureState:(NSInteger)reactTag
               sourceLayer:(nonnull NSString *)sourceLayer
                 featureId:(nullable NSString *)featureId
                       key:(nullable NSString *)key
                   resolve:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {
  [self
      withVectorSource:reactTag
                 block:^(MLRNVectorSource *vectorSource) {
                   if (![vectorSource removeFeatureState:sourceLayer featureID:featureId key:key]) {
                     reject(@"source_not_attached",
                            @"Source is not attached to a map, feature state was not removed", nil);
                     return;
                   }
                   resolve(nil);
                 }
                reject:reject
            methodName:@"removeFeatureState"];
}

@end
