//
//  RCTMLNShapeSource.m
//  RCTMLN
//
//  Created by Nick Italiano on 9/19/17.
//  Copyright © 2017 Mapbox Inc. All rights reserved.
//

#import "RCTMLNShapeSource.h"
#import "RCTMLNUtils.h"
#import "RCTMLNMapView.h"

@implementation RCTMLNShapeSource

static UIImage * _placeHolderImage;

- (void)setUrl: (NSString*) url
{
    _url = url;
    if (self.source != nil) {
        MLNShapeSource *source = (MLNShapeSource *)self.source;
        [source setURL: url == nil ? nil : [NSURL URLWithString:url]];
    }
}

- (void)setShape:(NSString *)shape
{
    _shape = shape;

    if (self.source != nil) {
        MLNShapeSource *source = (MLNShapeSource *)self.source;
        [source setShape: shape == nil ? nil : [RCTMLNUtils shapeFromGeoJSON:_shape]];
    }
}

- (void)addToMap
{
    if (self.map.style == nil) {
        return;
    }
    [super addToMap];
}

- (void)removeFromMap
{
    if (self.map.style == nil) {
        return;
    }

    [super removeFromMap];
}

- (nullable MLNSource*)makeSource
{
    NSDictionary<MLNShapeSourceOption, id> *options = [self _getOptions];

    if (_shape != nil) {
        MLNShape *shape = [RCTMLNUtils shapeFromGeoJSON:_shape];
        return [[MLNShapeSource alloc] initWithIdentifier:self.id shape:shape options:options];
    }

    if (_url != nil) {
        NSURL *url = [[NSURL alloc] initWithString:_url];
        return [[MLNShapeSource alloc] initWithIdentifier:self.id URL:url options:options];
    }
    return nil;
}

- (NSDictionary<MLNShapeSourceOption, id>*)_getOptions
{
    NSMutableDictionary<MLNShapeSourceOption, id> *options = [[NSMutableDictionary alloc] init];

    if (_cluster != nil) {
        options[MLNShapeSourceOptionClustered] = [NSNumber numberWithBool:[_cluster intValue] == 1];
    }

    if (_clusterRadius != nil) {
        options[MLNShapeSourceOptionClusterRadius] = _clusterRadius;
    }

    if (_clusterMaxZoomLevel != nil) {
        options[MLNShapeSourceOptionMaximumZoomLevelForClustering] = _clusterMaxZoomLevel;
    }

    if (_clusterProperties != nil) {
       NSMutableDictionary<NSString *, NSArray *> *properties = [NSMutableDictionary new];

        for (NSString *propertyName in _clusterProperties.allKeys) {
            NSArray<NSExpression *> *expressions = [_clusterProperties objectForKey: propertyName];
            NSExpression *firstExpression = [NSExpression expressionWithMLNJSONObject:[expressions objectAtIndex: 0]];
            NSExpression *secondExpression = [NSExpression expressionWithMLNJSONObject:[expressions objectAtIndex: 1]];

            [properties setObject:@[firstExpression, secondExpression] forKey:propertyName];
        }

        options[MLNShapeSourceOptionClusterProperties] = properties;
    }
    
    if (_maxZoomLevel != nil) {
        options[MLNShapeSourceOptionMaximumZoomLevel] = _maxZoomLevel;
    }

    if (_buffer != nil) {
        options[MLNShapeSourceOptionBuffer] = _buffer;
    }

    if (_tolerance != nil) {
        options[MLNShapeSourceOptionSimplificationTolerance] = _tolerance;
    }

    if (_lineMetrics != nil) {
        options[MLNShapeSourceOptionLineDistanceMetrics] = _lineMetrics;
    }

    return options;
}

- (nonnull NSArray<id <MLNFeature>> *)featuresMatchingPredicate:(nullable NSPredicate *)predicate
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;

    return [shapeSource featuresMatchingPredicate:predicate];
}

- (double)getClusterExpansionZoom:(nonnull NSString *)featureJSON
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;

    MLNPointFeature *feature = (MLNPointFeature*)[RCTMLNUtils shapeFromGeoJSON:featureJSON];
 
    return [shapeSource zoomLevelForExpandingCluster:(MLNPointFeatureCluster *)feature];
}

- (nonnull NSArray<id <MLNFeature>> *)getClusterLeaves:(nonnull NSString *)featureJSON
    number:(NSUInteger)number
    offset:(NSUInteger)offset
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;

    MLNPointFeature *feature = (MLNPointFeature*)[RCTMLNUtils shapeFromGeoJSON:featureJSON];

    MLNPointFeatureCluster * cluster = (MLNPointFeatureCluster *)feature;
    return [shapeSource leavesOfCluster:cluster offset:offset limit:number];
}

- (nonnull NSArray<id <MLNFeature>> *)getClusterChildren:(nonnull NSString *)featureJSON
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;
    
    MLNPointFeature *feature = (MLNPointFeature*)[RCTMLNUtils shapeFromGeoJSON:featureJSON];
    
    MLNPointFeatureCluster * cluster = (MLNPointFeatureCluster *)feature;
    return [shapeSource childrenOfCluster:cluster];
}


// Deprecated. Will be removed in 9+ ver.
- (double)getClusterExpansionZoomById:(nonnull NSNumber *)clusterId
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;
    NSArray<id<MLNFeature>> *features = [shapeSource featuresMatchingPredicate: [NSPredicate predicateWithFormat:@"%K = %i", @"cluster_id", clusterId.intValue]];
    if (features.count == 0) {
        return -1;
    }
    return [shapeSource zoomLevelForExpandingCluster:(MLNPointFeatureCluster *)features[0]];
}

// Deprecated. Will be removed in 9+ ver.
- (nonnull NSArray<id <MLNFeature>> *)getClusterLeavesById:(nonnull NSNumber *)clusterId
    number:(NSUInteger)number
    offset:(NSUInteger)offset
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;
    
    NSPredicate* predicate = [NSPredicate predicateWithFormat:@"cluster_id == %@", clusterId];
    NSArray<id<MLNFeature>> *features = [shapeSource featuresMatchingPredicate:predicate];
    
    MLNPointFeatureCluster * cluster = (MLNPointFeatureCluster *)features[0];
    return [shapeSource leavesOfCluster:cluster offset:offset limit:number];
}

// Deprecated. Will be removed in 9+ ver.
- (nonnull NSArray<id <MLNFeature>> *)getClusterChildrenById:(nonnull NSNumber *)clusterId
{
    MLNShapeSource *shapeSource = (MLNShapeSource *)self.source;
    
    NSPredicate* predicate = [NSPredicate predicateWithFormat:@"cluster_id == %@", clusterId];
    NSArray<id<MLNFeature>> *features = [shapeSource featuresMatchingPredicate:predicate];
    
    MLNPointFeatureCluster * cluster = (MLNPointFeatureCluster *)features[0];
    return [shapeSource childrenOfCluster:cluster];
}

@end
