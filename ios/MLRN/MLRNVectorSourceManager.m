#import <React/RCTUIManager.h>

#import "MLRNVectorSourceManager.h"
#import "MLRNVectorSource.h"

#import "FilterParser.h"

@implementation MLRNVectorSourceManager

RCT_EXPORT_MODULE(MLRNVectorSource);

RCT_EXPORT_VIEW_PROPERTY(id, NSString);

- (UIView*)view
{
    return [MLRNVectorSource new];
}

RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(tileUrlTemplates, NSArray)
RCT_EXPORT_VIEW_PROPERTY(attribution, NSString)

RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(tms, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hasPressListener, BOOL)
RCT_REMAP_VIEW_PROPERTY(onMapboxVectorSourcePress, onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(hitbox, NSDictionary)


RCT_EXPORT_METHOD(features:(nonnull NSNumber*)reactTag
                  withLayerIDs:(NSArray<NSString*>*)layerIDs
                  withFilter:(NSArray<NSDictionary<NSString *, id> *> *)filter
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *manager, NSDictionary<NSNumber*, UIView*> *viewRegistry) {
        MLRNVectorSource* vectorSource = viewRegistry[reactTag];
        
        if (![vectorSource isKindOfClass:[MLRNVectorSource class]]) {
            RCTLogError(@"Invalid react tag, could not find MLRNMapView");
            return;
        }

        NSSet* layerIDSet = nil;
        if (layerIDs != nil && layerIDs.count > 0) {
            layerIDSet = [NSSet setWithArray:layerIDs];
        }
        NSPredicate* predicate = [FilterParser parse:filter];
        NSArray<id<MLNFeature>> *shapes = [vectorSource
                                           featuresInSourceLayersWithIdentifiers: layerIDSet
                                           predicate: predicate];
        
        NSMutableArray<NSDictionary*> *features = [[NSMutableArray alloc] initWithCapacity:shapes.count];
        for (int i = 0; i < shapes.count; i++) {
            [features addObject:shapes[i].geoJSONDictionary];
        }
        
        resolve(@{
                  @"data": @{ @"type": @"FeatureCollection", @"features": features }
                  });
    }];
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
    RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

@end
