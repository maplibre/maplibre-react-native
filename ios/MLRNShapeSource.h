#import <React/RCTBridge.h>
#import "MLRNSource.h"

@import MapLibre;

@interface MLRNShapeSource : MLRNSource

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, copy, nullable) NSString *url;
@property (nonatomic, copy, nullable) NSString *shape;

@property (nonatomic, strong, nullable) NSNumber *cluster;
@property (nonatomic, strong, nullable) NSNumber *clusterRadius;
@property (nonatomic, strong, nullable) NSNumber *clusterMinPoints;
@property (nonatomic, strong, nullable) NSNumber *clusterMaxZoomLevel;
@property (nonatomic, strong, nullable)
    NSDictionary<NSString *, NSArray<NSExpression *> *> *clusterProperties;

@property (nonatomic, strong, nullable) NSNumber *maxZoomLevel;
@property (nonatomic, strong, nullable) NSNumber *buffer;
@property (nonatomic, strong, nullable) NSNumber *tolerance;
@property (nonatomic, strong, nullable) NSNumber *lineMetrics;

@property (nonatomic, copy, nullable) RCTBubblingEventBlock onPress;
@property (nonatomic, assign) BOOL hasPressListener;

- (nonnull NSArray<id<MLNFeature>> *)featuresMatchingPredicate:(nullable NSPredicate *)predicate;
- (nonnull NSArray<id<MLNFeature>> *)getClusterLeaves:(nonnull NSString *)featureJSON
                                               number:(NSUInteger)number
                                               offset:(NSUInteger)offset;
- (nonnull NSArray<id<MLNFeature>> *)getClusterChildren:(nonnull NSString *)featureJSON;

- (double)getClusterExpansionZoom:(nonnull NSString *)featureJSON;

@end
