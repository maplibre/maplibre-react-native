#import <React/RCTBridge.h>
#import "MLRNSource.h"

@import MapLibre;

@interface MLRNShapeSource : MLRNSource

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSString *shape;

@property (nonatomic, strong) NSNumber *cluster;
@property (nonatomic, strong) NSNumber *clusterRadius;
@property (nonatomic, strong) NSNumber *clusterMaxZoomLevel;
@property (nonatomic, strong) NSDictionary<NSString *, NSArray<NSExpression *> *> *clusterProperties;

@property (nonatomic, strong) NSNumber *maxZoomLevel;
@property (nonatomic, strong) NSNumber *buffer;
@property (nonatomic, strong) NSNumber *tolerance;
@property (nonatomic, strong) NSNumber *lineMetrics;

@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, assign) BOOL hasPressListener;

- (nonnull NSArray<id <MLNFeature>> *)featuresMatchingPredicate:(nullable NSPredicate *)predicate;
- (nonnull NSArray<id <MLNFeature>> *)getClusterLeaves:(nonnull NSString *)featureJSON
                                                number:(NSUInteger)number
                                                offset:(NSUInteger)offset;
- (nonnull NSArray<id <MLNFeature>> *)getClusterChildren:(nonnull NSString *)featureJSON;                                               

- (double)getClusterExpansionZoom:(nonnull NSString *)featureJSON;

@end
