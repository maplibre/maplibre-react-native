#import <React/RCTUIManager.h>

#import "MLRNShapeSourceManager.h"
#import "MLRNShapeSource.h"

#import "FilterParser.h"

@implementation MLRNShapeSourceManager

RCT_EXPORT_MODULE(MLRNShapeSource)

RCT_EXPORT_VIEW_PROPERTY(id, NSString)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(shape, NSString)

RCT_EXPORT_VIEW_PROPERTY(cluster, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clusterRadius, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clusterMaxZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(clusterProperties, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(buffer, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(tolerance, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(lineMetrics, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(images, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(nativeImages, NSArray)
RCT_EXPORT_VIEW_PROPERTY(hasPressListener, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hitbox, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(onMapboxShapeSourcePress, onPress, RCTBubblingEventBlock)

- (UIView*)view
{
    MLRNShapeSource *source = [MLRNShapeSource new];
    source.bridge = self.bridge;
    return source;
}

RCT_EXPORT_METHOD(features:(nonnull NSNumber*)reactTag
                  withFilter:(NSArray *)filter
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        MLRNShapeSource* shapeSource = viewRegistry[reactTag];

        if (![shapeSource isKindOfClass:[MLRNShapeSource class]]) {
            RCTLogError(@"Invalid react tag, could not find MLRNMapView");
            return;
        }

        NSPredicate* predicate = [FilterParser parse:filter];
        NSArray<id<MLNFeature>> *shapes = [shapeSource featuresMatchingPredicate: predicate];

        NSMutableArray<NSDictionary*> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
        for (int i = 0; i < shapes.count; i++) {
            [features addObject:shapes[i].geoJSONDictionary];
        }

        resolve(@{
                  @"data": @{ @"type": @"FeatureCollection", @"features": features }
                  });
    }];
}

RCT_EXPORT_METHOD(getClusterExpansionZoom:(nonnull NSNumber*)reactTag
                                featureJSON:(nonnull NSString*)featureJSON
                                 resolver:(RCTPromiseResolveBlock)resolve
                                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        MLRNShapeSource* shapeSource = (MLRNShapeSource *)viewRegistry[reactTag];

        if (![shapeSource isKindOfClass:[MLRNShapeSource class]]) {
            RCTLogError(@"Invalid react tag, could not find MLRNMapView");
            return;
        }

        double zoom = [shapeSource getClusterExpansionZoom: featureJSON];
        if (zoom == -1) {
          reject(@"zoom_error", [NSString stringWithFormat:@"Could not get zoom for cluster %@", featureJSON], nil);
          return;
        }
        resolve(@{@"data":@(zoom)});
    }];
}


RCT_EXPORT_METHOD(getClusterLeaves:(nonnull NSNumber*)reactTag
                  featureJSON:(nonnull NSString*)featureJSON
                  number:(NSUInteger) number
                  offset:(NSUInteger) offset
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        MLRNShapeSource* shapeSource = (MLRNShapeSource *)viewRegistry[reactTag];

        NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterLeaves:featureJSON number:number offset:offset];

        NSMutableArray<NSDictionary*> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
        for (int i = 0; i < shapes.count; i++) {
            [features addObject:shapes[i].geoJSONDictionary];
        }

        resolve(@{
                  @"data": @{ @"type": @"FeatureCollection", @"features": features }
                  });
    }];
}

RCT_EXPORT_METHOD(getClusterChildren:(nonnull NSNumber*)reactTag
                  featureJSON:(nonnull NSString*)featureJSON                
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        MLRNShapeSource* shapeSource = (MLRNShapeSource *)viewRegistry[reactTag];

        NSArray<id<MLNFeature>> *shapes = [shapeSource getClusterChildren: featureJSON];

        NSMutableArray<NSDictionary*> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
        for (int i = 0; i < shapes.count; i++) {
            [features addObject:shapes[i].geoJSONDictionary];
        }

        resolve(@{
                  @"data": @{ @"type": @"FeatureCollection", @"features": features }
                  });
    }];
}

@end
