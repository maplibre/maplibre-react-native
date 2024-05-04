//
//  RCTMLNShapeSource.h
//  RCTMLN
//
//  Created by Nick Italiano on 9/19/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import <React/RCTBridge.h>
#import "RCTMLNSource.h"

@import MapLibre;

@interface RCTMLNShapeSource : RCTMLNSource

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

// Deprecated. Will be removed in 9+ ver.
- (nonnull NSArray<id <MLNFeature>> *)getClusterLeavesById:(nonnull NSNumber *)clusterId
                                                number:(NSUInteger)number    
                                                offset:(NSUInteger)offset;

// Deprecated. Will be removed in 9+ ver.                                                
- (nonnull NSArray<id <MLNFeature>> *)getClusterChildrenById:(nonnull NSNumber *)clusterId;     
                                          
// Deprecated. Will be removed in 9+ ver.
- (double)getClusterExpansionZoomById:(nonnull NSNumber *)clusterId;

@end
