#import "MLRNCircleLayerManager.h"
#import "MLRNCircleLayer.h"

@implementation MLRNCircleLayerManager

RCT_EXPORT_MODULE()

// circle layer props
RCT_REMAP_VIEW_PROPERTY(source-layer, sourceLayerID, NSString);

// standard layer props
RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_REMAP_VIEW_PROPERTY(source, sourceID, NSString);
RCT_EXPORT_VIEW_PROPERTY(filter, NSArray);

RCT_REMAP_VIEW_PROPERTY(afterId, aboveLayerID, NSString);
RCT_REMAP_VIEW_PROPERTY(beforeId, belowLayerID, NSString);
RCT_EXPORT_VIEW_PROPERTY(layerIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(reactStyle, NSDictionary);

RCT_REMAP_VIEW_PROPERTY(maxzoom, maxZoomLevel, NSNumber);
RCT_REMAP_VIEW_PROPERTY(minzoom, minZoomLevel, NSNumber);

- (UIView *)view {
  MLRNCircleLayer *layer = [MLRNCircleLayer new];
  layer.bridge = self.bridge;
  return layer;
}

@end
