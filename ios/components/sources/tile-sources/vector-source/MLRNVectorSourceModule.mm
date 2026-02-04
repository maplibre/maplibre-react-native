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

@end
